from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin

from .models import Category, Image, Product

admin.site.register(Category, DraggableMPTTAdmin)
admin.site.register(Image)


class ItemAdmin(admin.ModelAdmin):
    list_display = ["pk", "owner", "title"]


class ImageInline(admin.StackedInline):
    model = Image
    fk_name = "product"
    # image = SizedImageCenterpointClickDjangoAdminField(required=False)
    fields = ("name", "alt_text", "is_feature", "product", "id")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # list_display_links = ['id', 'vendor', 'category']
    list_select_related = True
    list_display = [
        "id",
        "title",
        "vendor",
        "is_available",
        "condition",
        "category",
        "created_at",
    ]
    list_fiter = ("category", "is_available", "vendor" "condition")
    search_fields = ["title", "vendor", "description"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [
        ImageInline,
    ]
