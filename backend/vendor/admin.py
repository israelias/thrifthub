from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from order.models import Order as OrderModel
from store.models import Favorite, Product
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
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


# class VendorInline(admin.StackedInline):
#     model = Vendor
#     can_delete = False
#     verbose_name_plural = "vendor"


# class UserAdmin(BaseUserAdmin):
#     inlines = (
#         VendorInline,
#         ProductInline,
#         VendorFavoriteInline,
#         VendorFriendInline,
#         OrderRequestsInline,
#         OrdersMadeInline,
#     )


# admin.site.unregister(User)
# admin.site.register(User, UserAdmin)
@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    inlines = [ProductInline, VendorFavoriteInline, VendorFriendInline, OrderRequestsInline, OrdersMadeInline]
