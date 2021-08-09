import datetime
import os
import random
import string

from django.conf import settings
from django.db import models, transaction
from django.db.models import Q
from django.db.models.constraints import UniqueConstraint
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.urls import reverse
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey
from vendor.models import Vendor
from versatileimagefield.fields import PPOIField, VersatileImageField
from versatileimagefield.image_warmer import VersatileImageFieldWarmer
from versatileimagefield.placeholder import (
    OnDiscPlaceholderImage,
    OnStoragePlaceholderImage,
)


def upload_path(instance, filename):
    return "/".join(["images", str(instance.name), filename])


def rand_slug():
    return "".join(random.choice(string.ascii_letters + string.digits) for _ in range(6))


class Category(MPTTModel):
    """
    Category Table as MPTT model.
    """

    name = models.CharField(
        verbose_name=_("Category Name"),
        help_text=_("Required and unique"),
        max_length=255,
        unique=True,
    )
    slug = models.SlugField(verbose_name=_("Category safe URL"), max_length=255, unique=True)
    parent = TreeForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="children")
    ordering = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class MPTTMeta:
        order_insertion_by = ["name"]

    class Meta:
        ordering = ["ordering"]
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")

    def get_absolute_url(self):
        return reverse("store:category_list", args=[self.slug])

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(rand_slug() + "-" + self.name)
        super(Category, self).save(*args, **kwargs)

    def get_slug_list(self):
        try:
            ancestors = self.get_ancestors(include_self=True)
        except:
            ancestors = []
        else:
            ancestors = [i.slug for i in ancestors]
        slugs = []
        for i in range(len(ancestors)):
            slugs.append("/".join(ancestors[: i + 1]))
        return slugs

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name


class Product(models.Model):
    """
    The Product table for all product items.
    """

    CONDITION_CHOICES = (
        (5, _("Mint")),
        (4, _("New")),
        (3, _("Good")),
        (2, _("Fair")),
        (1, _("Damaged")),
    )

    category = models.ForeignKey(Category, related_name="products", on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, related_name="products", on_delete=models.CASCADE)
    title = models.CharField(
        verbose_name=_("Title"),
        help_text=_("Required"),
        max_length=255,
    )
    description = models.TextField(verbose_name=_("description"), help_text=_("Not Required"), blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, null=True, blank=True)
    price = models.DecimalField(
        verbose_name=_("Price"),
        help_text=_("Maximum 999,999.99"),
        error_messages={
            "name": {
                "max_length": _("The price must be between 0 and 999,999.99."),
            },
        },
        max_digits=8,
        decimal_places=2,
    )

    is_available = models.BooleanField(
        verbose_name=_("Product availability"),
        help_text=_("Change product availability"),
        default=True,
    )
    condition = models.PositiveIntegerField(choices=CONDITION_CHOICES, default=3)
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = _("Product")
        verbose_name_plural = _("Products")

    def get_absolute_url(self):
        return reverse("store:product-detail", args=[self.slug])

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(self.title)

        super(Product, self).save(*args, **kwargs)

    def __str__(self):
        return self.title

    def __unicode__(self):
        return self.title


class Image(models.Model):
    """
    The Product Versatile Image table.
    """

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="product_images")
    name = models.CharField(max_length=255, null=True, blank=True)
    image = VersatileImageField(
        "Image",
        help_text=_("Upload a product image"),
        upload_to=upload_path,
        ppoi_field="image_ppoi",
        # null=True,
        # blank=True,
        default=settings.MEDIA_ROOT + "/images/default_placeholder.png",
        placeholder_image=OnDiscPlaceholderImage(path=settings.MEDIA_ROOT + "/images/default_placeholder.png"),
    )
    image_ppoi = PPOIField("Image PPOI")
    alt_text = models.CharField(
        verbose_name=_("Alternative text"),
        help_text=_("Please add alternative text"),
        max_length=255,
        null=True,
        blank=True,
    )
    is_feature = models.BooleanField(
        default=False,
        verbose_name=_("Feature Image"),
        help_text=_("Assign this as the feature image"),
    )
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    class Meta:
        ordering = ["is_feature"]
        verbose_name = _("Versatile Image")
        verbose_name_plural = _("Versatile Images")
        UniqueConstraint(fields=["is_feature"], condition=Q(is_feature=True), name="is_feature_is_unique")

    def get_thumbnail(self):
        if self.image:
            thumbnail = self.make_thumbnail(self.image)
            return thumbnail
        else:
            return "https://via.placeholder.com/240x180.jpg"

    def make_thumbnail(self, image, size=("240x180")):
        return image.thumbnail[size].url

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.name:
            if self.is_feature:
                self.name = self.product.title + "-" + "feature" + "-" + rand_slug()

            self.name = self.product.title + "-" + "image" + "-" + rand_slug()

        if not self.alt_text:
            self.alt_text = self.product.title + " photo"

        super(Image, self).save(*args, **kwargs)


@receiver(post_save, sender=Image)
def warm_image_instances_post_save(sender, instance, **kwargs):
    """Ensures Image objects are created post-save"""
    all_img_warmer = VersatileImageFieldWarmer(
        instance_or_queryset=instance, rendition_key_set="default_product", image_attr="image", verbose=True
    )
    num_created, failed_to_create = all_img_warmer.warm()


class Favorite(models.Model):
    vendor = models.OneToOneField(Vendor, related_name="favorites", on_delete=models.CASCADE)
    favorites = models.ManyToManyField(Product, related_name="favorites")
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True, editable=False)

    class Meta:
        ordering = ("-created_at",)
        verbose_name = _("Favorite Product")
        verbose_name_plural = _("Favorite Products")

    def __str__(self):
        return "%s's favorites" % self.vendor.name


@receiver(pre_delete, sender=Product)
def delete_category_if_null(sender, instance, **kwargs):
    """
    Delete category objects if it has no other related products.

    """
    # category = Category.objects.filter(products__in=instance)
    products = instance.category.products.filter(
        category__in=Category.objects.get(slug=instance.category.slug).get_descendants(include_self=True)
    )
    if not products.exists():
        products.delete()
