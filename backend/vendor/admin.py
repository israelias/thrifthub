from django.contrib import admin
from order.models import Order as OrderModel
from store.models import Favorite, Product
from .models import Friend, Vendor


class VendorFavoriteInline(admin.StackedInline):
    model = Favorite
    fields = ("favorites",)


class VendorFriendInline(admin.StackedInline):
    model = Friend
    fields = ("vendors",)


class OrderRequestsInline(admin.StackedInline):
    model = OrderModel
    fk_name = "vendor"


class OrdersMadeInline(admin.StackedInline):
    model = OrderModel
    fk_name = "buyer"


class ProductInline(admin.StackedInline):
    model = Product


@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "created_by"]
    list_fiter = ["created_by", "category"]
    search_fields = ["name", "created_by"]
    inlines = [
        ProductInline,
        VendorFavoriteInline,
        VendorFriendInline,
        OrderRequestsInline,
        OrdersMadeInline,
    ]
