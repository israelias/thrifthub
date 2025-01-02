import datetime

from django.conf import settings
from django.contrib.auth.models import User
from django.core.cache import cache
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from versatileimagefield.fields import PPOIField, VersatileImageField
from versatileimagefield.image_warmer import VersatileImageFieldWarmer
from versatileimagefield.placeholder import (
    OnDiscPlaceholderImage,
    OnStoragePlaceholderImage,
)


def upload_path(instance, filename: str) -> str:
    """
    The upload_path function is used to determine the location of uploaded files.
    It takes two arguments: instance and filename. The instance argument contains a
    field called name, which is set to the name of the user who created this profile.
    The filename argument contains a field called file, which is set to whatever file
    the user uploads as their profile picture.

    Args:
        instance: Access the instance of the model that is being saved
        filename: Set the name of the file that is uploaded

    Returns:
        The path to the profile image
    """
    return "/".join(["profiles", str(instance.name), filename])


class Vendor(models.Model):
    """It creates a class called Vendor that inherits from the Model class."""
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)
    created_by = models.OneToOneField(User, related_name="vendor", on_delete=models.CASCADE)
    slug = models.SlugField(verbose_name=_("Vendor safe URL"), max_length=255, unique=True)
    online = models.BooleanField(default=False)
    image = VersatileImageField(
        "Image",
        help_text=_("Upload a profile image"),
        upload_to=upload_path,
        null=True,
        blank=True,
        placeholder_image=OnDiscPlaceholderImage(path=settings.MEDIA_ROOT + "/images/default_avatar.png"),
    )

    class Meta:
        ordering = ["name"]
        verbose_name = _("Vendor")
        verbose_name_plural = _("Vendors")

    def __str__(self) -> str:
        return self.name

    def __unicode__(self) -> str:
        return self.name

    def get_absolute_url(self) -> str:
        return reverse("vendor:vendor_list", args=[self.slug])

    def get_balance(self) -> float:
        items = self.items.filter(vendor_paid=False, order__vendors__in=[self.id])
        return sum((item.product.price * item.quantity) for item in items)

    def get_paid_amount(self) -> float:
        items = self.items.filter(vendor_paid=True, order__vendors__in=[self.id])
        return sum((item.product.price * item.quantity) for item in items)


@receiver(post_save, sender=Vendor)
def warm_vendor_image(sender, instance, **kwargs) -> None:
    """Ensures Vendor-specific images objects are created post-save"""
    vendor_img_warmer = VersatileImageFieldWarmer(
        instance_or_queryset=instance, rendition_key_set="default_avatar", image_attr="image", verbose=True
    )
    num_created, failed_to_create = vendor_img_warmer.warm()


class Friend(models.Model):
    """It creates a class called Friend that inherits from the Model class."""

    vendors = models.ManyToManyField(Vendor, related_name="vendors")
    current_vendor = models.ForeignKey(Vendor, related_name="owner", null=True, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return "%s's friends" % self.current_vendor.name

    @classmethod
    def make_friend(cls, current_vendor, other_vendor) -> None:
        """
        The make_friend function creates a Friend object and adds the other_vendor to the current_vendor's friends list.
        If a Friend object already exists for current_vendor, then it just adds other_vendor to that friend's friends list.

        Args:
            cls: Refer to the current class
            current_vendor: Set the current_vendor to the vendor that is currently logged in
            other_vendor: Add the other vendor to the current_vendor's friends list

        Returns:
            A tuple of the friend object and a boolean value indicating whether or not the friend was created
        """
        friend, created = cls.objects.get_or_create(current_vendor=current_vendor)
        friend.vendors.add(other_vendor)

    @classmethod
    def lose_friend(cls, current_vendor, other_vendor) -> None:
        """
        The lose_friend function removes the other_vendor from the current_vendor's list of friends.
        It returns a tuple containing a boolean value indicating whether or not it was successful, and
        a message to be displayed to the user.

        Args:
            cls: Create a new object of the class
            current_vendor: Get the current vendor object from the database
            other_vendor: Specify the vendor that is being removed from the friends list

        Returns:
            The friend object
        """
        friend, created = cls.objects.get_or_create(current_vendor=current_vendor)
        friend.vendors.remove(other_vendor)
