from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from order.admin import OrderItemInline
from store.models import Product

from .models import Vendor

# admin.site.register(Vendor)
# class VendorAdmin(admin.ModelAdmin):
#     model = Vendor


class ProductInline(admin.TabularInline):
    model = Product


@admin.register(Vendor)
class ProductAdmin(admin.ModelAdmin):
    inlines = [
        # ProductCategoryInline,
        # ProductVendorInline,
        # ProductImageInline,
        ProductInline,
        OrderItemInline,
    ]
