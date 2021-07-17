from django.contrib import admin
from store.models import Product
from vendor.models import Vendor

from .models import Order as OrderModel
from .models import OrderDetail


class OrderDetailInline(admin.StackedInline):
    model = OrderDetail


@admin.register(OrderModel)
class OrderAdmin(admin.ModelAdmin):
    inlines = [
        OrderDetailInline,
    ]
