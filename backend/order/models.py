from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField
from store.models import Product
from vendor.models import Vendor


class Order(models.Model):
    ORDER_STATUS = (
        ("PENDING", _("Pending")),
        ("OFFERED", _("Offer Made")),
        ("ACCEPTED", _("Offer Accepted")),
        ("DENIED", _("Offer Denied")),
        ("PROCESSING", _("Payment Processing")),
        ("COMPLETED", _("Payment Completed")),
    )

    product = models.ForeignKey(Product, related_name="ordered_product", on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, related_name="order_requests", on_delete=models.CASCADE, null=True, blank=True)
    buyer = models.ForeignKey(Vendor, related_name="orders_made", on_delete=models.CASCADE)

    status = models.CharField(max_length=32, choices=ORDER_STATUS, default="PENDING")

    amount = models.DecimalField(
        verbose_name=_("Amount to offer"),
        help_text=_("Maximum is the price of the product."),
        error_messages={
            "name": {
                "max_length": _("The price must be between 0.01 and the price of the product"),
            },
        },
        max_digits=8,
        decimal_places=2,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(_("Created at"), auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Order")
        verbose_name_plural = _("Orders")

    def save(self, *args, **kwargs):
        """
        If the Order instance is an immediate purchase and not an offer,
        set the amount to be the price of the product.

        """

        if not self.amount:
            self.amount = self.product.price
            self.status = "PROCESSING"

        if not self.vendor:
            self.vendor = self.product.vendor

        super(Order, self).save(*args, **kwargs)

    def get_price(self):
        return self.product.price

    def get_absolute_url(self):
        return reverse("order:order_list", args=[self.id])

    def __str__(self):
        return f"Product {self.product.title} ordered by {self.buyer.name}"


class OrderDetail(models.Model):
    full_name = models.CharField(max_length=50, null=False, blank=False)
    email = models.EmailField(max_length=254, null=False, blank=False)
    phone_number = models.CharField(max_length=20, null=False, blank=False)
    country = CountryField(blank_label="Country *", null=False, blank=False)
    zipcode = models.CharField(max_length=20, null=True, blank=True)
    town_or_city = models.CharField(max_length=40, null=False, blank=False)
    street_address1 = models.CharField(max_length=80, null=False, blank=False)
    street_address2 = models.CharField(max_length=80, null=True, blank=True)
    county = models.CharField(max_length=80, null=True, blank=True)

    created_at = models.DateTimeField(_("Created at"), auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    stripe_pid = models.CharField(max_length=254, null=False, blank=False, default="")

    order = models.ForeignKey(Order, related_name="order_detail", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Order Detail")
        verbose_name_plural = _("Order Details")

    def get_absolute_url(self):
        return reverse("orderdetails:orderdetails_list", args=[self.id])

    def __str__(self):
        return f"Order Details of {self.full_name} on order {self.order.id}"


@receiver(pre_delete, sender=Order)
def reset_product_is_available(sender, instance, **kwargs):
    """
    Reset an product's availability if an order for that product is deleted.

    """

    instance.product.is_available = True
    instance.product.save()

