from django.contrib.auth.models import User
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class Vendor(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.OneToOneField(User, related_name="vendor", on_delete=models.CASCADE)
    slug = models.SlugField(verbose_name=_("Vendor safe URL"), max_length=255, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name = _("Vendor")
        verbose_name_plural = _("Vendors")

    def __str__(self):
        return self.name

    def __unicode__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("vendor:vendor_list", args=[self.slug])

    def get_balance(self):
        items = self.items.filter(vendor_paid=False, order__vendors__in=[self.id])
        return sum((item.product.price * item.quantity) for item in items)

    def get_paid_amount(self):
        items = self.items.filter(vendor_paid=True, order__vendors__in=[self.id])
        return sum((item.product.price * item.quantity) for item in items)


# class Favorite(models.Model):
#     vendor = models.OneToOneField(Vendor, related_name="favorites", on_delete=models.CASCADE)
#     favorites = models.ManyToManyField(Product, related_name="favorites")

#     def __str__(self):
#         return "%s's favorites" % self.vendor.name


class Friend(models.Model):
    vendors = models.ManyToManyField(Vendor, related_name="vendors")
    current_vendor = models.ForeignKey(Vendor, related_name="owner", null=True, on_delete=models.CASCADE)

    def __str__(self):
        return "%s's friends" % self.current_vendor.name

    @classmethod
    def make_friend(cls, current_vendor, other_vendor):
        friend, created = cls.objects.get_or_create(current_vendor=current_vendor)
        friend.vendors.add(other_vendor)

    @classmethod
    def lose_friend(cls, current_vendor, other_vendor):
        friend, created = cls.objects.get_or_create(current_vendor=current_vendor)
        friend.vendors.remove(other_vendor)
