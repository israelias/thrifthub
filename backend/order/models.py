from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from store.models import Product
from vendor.models import Vendor


class Order(models.Model):
    product = models.ForeignKey(Product, related_name="ordered", on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, related_name="order_requests", on_delete=models.CASCADE)
    buyer = models.ForeignKey(Vendor, related_name="orders_made", on_delete=models.CASCADE)
    paid = models.BooleanField(
        verbose_name=_("Payment processed"),
        default=False,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Order")
        verbose_name_plural = _("Orders")

    def __str__(self):
        return "%s" % self.id

    def get_total_price(self):
        return self.product.price

    def get_absolute_url(self):
        return reverse("order:order_list", args=[self.id])

    def __str__(self):
        return "%s" % self.id


class OrderDetail(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=8, decimal_places=2)
    order = models.ForeignKey(Order, related_name="order_detail", on_delete=models.CASCADE)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Order Detail")
        verbose_name_plural = _("Order Details")

    def get_absolute_url(self):
        return reverse("orderdetails:orderdetails_list", args=[self.id])

    def __str__(self):
        return self.first_name
