import random


# import order.models as order_models
# import vendor.models
# import vendor.serializers as vendor_serializers
# from order import serializers as order_serializers
from rest_framework import serializers

from .models import Category, Product, ProductImage

# from vendor.serializers import VendorAdminSerializer
# from vendor import serializers as vendor_serializers


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["image", "alt_text"]


class CategorySerializer(serializers.ModelSerializer):
    products = serializers.StringRelatedField(many=True)

    class Meta:
        model = Category
        fields = ["name", "products", "slug"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    # vendor = vendor_serializers.VendorSerializer(read_only=True)
    product_image = ImageSerializer(many=True, read_only=True)

    vendor = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "category", "vendor", "title", "description", "slug", "regular_price", "product_image"]


class ProductCartSerializer(serializers.BaseSerializer):
    category = CategorySerializer(read_only=True)
    # vendor = vendor_serializers.VendorSerializer(read_only=True)
    product_image = ImageSerializer(many=True, read_only=True)
    vendor = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Product
        fields = ["id", "category", "vendor", "title", "description", "slug", "regular_price", "product_image"]

    def to_representation(self, instance):
        imagesstring = '{"thumbnail": "%s", "image": "%s", "id": "mainimage"},' % (
            instance.get_thumbnail(),
            instance.image.url,
        )

        for image in instance.images.all():
            imagesstring += '{"thumbnail": "%s", "image": "%s", "id": "%s"},' % (
                image.get_thumbnail(),
                image.image.url,
                image.id,
            )

        print(imagesstring)

        similar_products = list(instance.category.products.exclude(id=instance.id))

        if len(similar_products) >= 4:
            similar_products = random.sample(similar_products, 4)

        return {
            "product": instance,
            "similar_products": similar_products,
            "imagesstring": "[" + imagesstring.rstrip(",") + "]",
        }
