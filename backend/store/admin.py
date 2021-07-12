from django.contrib import admin
from mptt.admin import MPTTModelAdmin


from .models import Category, Image, Product

admin.site.register(Category, MPTTModelAdmin)
admin.site.register(Image)


class ImageInline(admin.StackedInline):
    model = Image


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [
        ImageInline,
      
    ]
