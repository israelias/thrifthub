from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _

# from store import models
# from vendor import models
from store.models import Product
from vendor.models import Vendor


class Order(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    zipcode = models.CharField(max_length=100)
    place = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_amount = models.DecimalField(max_digits=8, decimal_places=2)
    vendors = models.ManyToManyField(Vendor, related_name="orders")

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Order")
        verbose_name_plural = _("Orders")

    def get_absolute_url(self):
        return reverse("order:order_list", args=[self.id])

    def __str__(self):
        return self.first_name


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="items", on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, related_name="items", on_delete=models.CASCADE)
    vendor_paid = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    quantity = models.IntegerField(default=1)

    class Meta:
        verbose_name = _("Order Item")
        verbose_name_plural = _("Order Items")

    def get_absolute_url(self):
        return reverse("order:orderitem_detail", args=[self.id])

    def __str__(self):
        return "%s" % self.id

    def get_total_price(self):
        return self.price * self.quantity
