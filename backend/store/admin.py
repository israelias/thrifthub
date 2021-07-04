from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from order.admin import OrderItemInline
from order.models import Order as OrderModel
from order.models import OrderItem
from vendor.models import Vendor

from .models import Category, Product, ProductImage

admin.site.register(Category, MPTTModelAdmin)


# class ProductCategoryInline(admin.TabularInline):
#     model = Category
# fk_name = "products"


class ProductImageInline(admin.TabularInline):
    model = ProductImage


# @admin.register(OrderModel)
# class OrderInline(admin.ModelAdmin):
#     model = OrderModel


# class OrderItemInline(admin.TabularInline):
#     model = OrderItem
#     inlines = [
#         OrderInline,
#     ]


# class ProductVendorInline(admin.TabularInline):
#     model = Vendor
# fk_name = "products"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [
        # ProductCategoryInline,
        # ProductVendorInline,
        ProductImageInline,
        OrderItemInline,
    ]
