from django.contrib import admin
from store.models import Product
from vendor.models import Vendor

from .models import Order as OrderModel
from .models import OrderItem

# admin.site.register(OrderModel)
# admin.site.register(OrderItem)


# class OrderInline(admin.TabularInline):
#     model = Order
# fk_name = "items"


class OrderItemInline(admin.TabularInline):
    model = OrderItem


# class OrderInline(admin.TabularInline):
#     model = OrderModel

# class ProductInline(admin.TabularInline):
#     model = Product
# fk_name = "items"


# class VendorInline(admin.TabularInline):
#     model = Vendor
# fk_name = "items"


# class ProductVendorInline(admin.TabularInline):
#     model = Vendor
#     fk_name = "products"


@admin.register(OrderModel)
class OrderAdmin(admin.ModelAdmin):
    inlines = [
        OrderItemInline,
        # ProductInline,
        # VendorInline,
    ]


# class Order(models.Model):
#     first_name = models.CharField(max_length=100)
#     last_name = models.CharField(max_length=100)
#     email = models.CharField(max_length=100)
#     address = models.CharField(max_length=100)
#     zipcode = models.CharField(max_length=100)
#     place = models.CharField(max_length=100)
#     phone = models.CharField(max_length=100)
#     created_at = models.DateTimeField(auto_now_add=True)
#     paid_amount = models.DecimalField(max_digits=8, decimal_places=2)
#     vendors = models.ManyToManyField(Vendor, related_name="orders")

#     class Meta:
#         ordering = ["-created_at"]

#     def __str__(self):
#         return self.first_name


# class OrderItem(models.Model):
#     order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
#     product = models.ForeignKey(Product, related_name="items", on_delete=models.CASCADE)
#     vendor = models.ForeignKey(Vendor, related_name="items", on_delete=models.CASCADE)
#     vendor_paid = models.BooleanField(default=False)
#     price = models.DecimalField(max_digits=8, decimal_places=2)
#     quantity = models.IntegerField(default=1)

#     def __str__(self):
#         return "%s" % self.id

#     def get_total_price(self):
#         return self.price * self.quantity
