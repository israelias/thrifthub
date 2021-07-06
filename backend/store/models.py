import random
import string
from io import BytesIO

from django.core.files import File
from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from mptt.models import MPTTModel, TreeForeignKey
from PIL import Image
from vendor.models import Vendor


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
    The Product table contining all product items.
    """

    category = models.ForeignKey(Category, related_name="products", on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, related_name="products", on_delete=models.CASCADE)
    title = models.CharField(
        verbose_name=_("title"),
        help_text=_("Required"),
        max_length=255,
    )
    description = models.TextField(verbose_name=_("description"), help_text=_("Not Required"), blank=True, null=True)
    slug = models.SlugField(max_length=255, unique=True, null=True, blank=True)
    regular_price = models.DecimalField(
        verbose_name=_("Regular price"),
        help_text=_("Maximum 999.99"),
        error_messages={
            "name": {
                "max_length": _("The price must be between 0 and 999.99."),
            },
        },
        max_digits=5,
        decimal_places=2,
    )
    discount_price = models.DecimalField(
        verbose_name=_("Discount price"),
        help_text=_("Maximum 999.99"),
        error_messages={
            "name": {
                "max_length": _("The price must be between 0 and 999.99."),
            },
        },
        max_digits=5,
        decimal_places=2,
    )
    is_active = models.BooleanField(
        verbose_name=_("Product visibility"),
        help_text=_("Change product visibility"),
        default=True,
    )
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)
    image = models.ImageField(
        verbose_name=_("single image"),
        help_text=_("Upload a dedicated product image"),
        upload_to="images/",
        default="images/default.png",
        blank=True,
        null=True,
    )
    thumbnail = models.ImageField(
        verbose_name=_("single thumbnail"),
        help_text=_("Upload a dedicated thumbnail image"),
        upload_to="images/",
        blank=True,
        null=True,
    )

    class Meta:
        ordering = ("-created_at",)
        verbose_name = _("Product")
        verbose_name_plural = _("Products")

    def get_thumbnail(self):
        if self.thumbnail:
            return self.thumbnail.url
        else:
            if self.image:
                self.thumbnail = self.make_thumbnail(self.image)
                self.save()

                return self.thumbnail.url
            else:
                return "https://via.placeholder.com/240x180.jpg"

    def make_thumbnail(self, image, size=(300, 200)):
        img = Image.open(image)
        img.convert("RGB")
        img.thumbnail(size)

        thumb_io = BytesIO()
        img.save(thumb_io, "JPEG", quality=85)

        thumbnail = File(thumb_io, name=image.name)

        return thumbnail

    def get_absolute_url(self):
        return reverse("store:product_detail", args=[self.slug])

    def save(self, *args, **kwargs):

        if not self.slug:
            self.slug = slugify(rand_slug() + "-" + self.title)

        super(Product, self).save(*args, **kwargs)

    def __str__(self):
        return self.title

    def __unicode__(self):
        return self.title


class ProductImage(models.Model):
    """
    The Product Image table.
    """

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="product_image")
    image = models.ImageField(
        verbose_name=_("image"),
        help_text=_("Upload a product image"),
        upload_to="images/",
        default="images/default.png",
    )
    thumbnail = models.ImageField(
        verbose_name=_("thumbnail"),
        help_text=_("Upload a thumbnail image"),
        upload_to="images/",
        blank=True,
        null=True,
    )

    alt_text = models.CharField(
        verbose_name=_("Alternative text"),
        help_text=_("Please add alternative text"),
        max_length=255,
        null=True,
        blank=True,
    )
    is_feature = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["is_feature"]
        verbose_name = _("Product Image")
        verbose_name_plural = _("Product Images")

    def get_thumbnail(self):
        if self.thumbnail:
            return self.thumbnail.url
        else:
            if self.image:
                self.thumbnail = self.make_thumbnail(self.image)
                self.save()

                return self.thumbnail.url
            else:
                return "https://via.placeholder.com/240x180.jpg"

    def make_thumbnail(self, image, size=(300, 200)):
        img = Image.open(image)
        img.convert("RGB")
        img.thumbnail(size)

        thumb_io = BytesIO()
        img.save(thumb_io, "JPEG", quality=85)

        thumbnail = File(thumb_io, name=image.name)

        return thumbnail

    def save(self, *args, **kwargs):

        if not self.alt_text:
            self.alt_text = slugify(rand_slug() + "-" + self.product.title)

        super(ProductImage, self).save(*args, **kwargs)
