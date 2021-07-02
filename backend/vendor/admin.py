from django.contrib import admin
from mptt.admin import MPTTModelAdmin

from .models import Vendor

admin.site.register(Vendor)
# class VendorAdmin(admin.ModelAdmin):
#     model = Vendor
