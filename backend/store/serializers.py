import random

import vendor.models as vendor_models
from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from versatileimagefield.serializers import VersatileImageFieldSerializer

from .models import Category, Image, Product


class ImageVersatileSerializer(FlexFieldsModelSerializer):
    """
    The sizes argument on VersatileImageFieldSerializer
    unpacks the list of 2-tuples using the value in the first position
    as the attribute of the image and the second position as a ‘Rendition Key’
    which dictates how the original image should be modified.
    """

    image = VersatileImageFieldSerializer(
        sizes=[
            ("full_size", "url"),
            ("thumbnail", "thumbnail__100x100"),
        ]
    )

    class Meta:
        model = Image
        fields = ["pk", "name", "image"]


class CategorySerializer(serializers.ModelSerializer):
    products = serializers.StringRelatedField(many=True)

    class Meta:
        model = Category
        fields = ["name", "products", "slug"]


class VendorSlugSerializer(serializers.ModelSerializer):
    class Meta:
        model = vendor_models.Vendor
        fields = ["name", "slug"]


class ImageNewSerializer(FlexFieldsModelSerializer):
    image = VersatileImageFieldSerializer(
        sizes=[
            ("full_size", "url"),
            ("thumbnail", "thumbnail__240x180"),
        ]
    )

    class Meta:
        model = Image
        fields = ["image", "alt_text", "is_feature"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    vendor = VendorSlugSerializer(read_only=True)
    product_images = ImageNewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "vendor",
            "title",
            "description",
            "slug",
            "price",
            "is_available",
            "product_images",
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField(read_only=True)
    vendor = serializers.StringRelatedField(read_only=True)
    product_images = ImageNewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "vendor",
            "title",
            "description",
            "slug",
            "price",
            "is_available",
            "product_images",
        ]


class ProductCartSerializer(FlexFieldsModelSerializer):
    category = CategorySerializer(read_only=True)
    vendor = serializers.StringRelatedField(read_only=True)
    similar_products = ProductSerializer(many=True)
    imagesstring = serializers.CharField()
    product = ProductSerializer()

    def to_representation(self, instance):
        all_images = []

        if instance.product_images is not None:
            for image in instance.product_images.all():
                all_images.append({"thumbnail": image.get_thumbnail(), "image": image.image.url, "id": image.id})

        similar_products = list(instance.category.products.exclude(id=instance.id))

        if len(similar_products) >= 4:
            similar_products = random.sample(similar_products, 4)

        all_products = ProductDetailSerializer(similar_products, many=True)

        current_product = ProductDetailSerializer(instance)

        return {
            "product": current_product.data,
            "similar_products": all_products.data,
        }


class VendorFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = vendor_models.Vendor
        fields = "__all__"


class CategoryFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductVersatileSerializer(FlexFieldsModelSerializer):
    similar_products = serializers.SerializerMethodField()
    absolute_url = serializers.CharField(source="get_absolute_url", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "vendor",
            "category",
            "description",
            "slug",
            "price",
            "is_available",
            "product_images",
            "similar_products",
            "absolute_url",
        ]
        expandable_fields = {
            "category": CategoryFullSerializer,
            "vendor": VendorFullSerializer,
            "product_images": (ImageNewSerializer, {"many": True}),
            "similar_products": (serializers.SerializerMethodField, {"many": True}),
        }

    def get_similar_products(self, obj):
        similar_products = list(obj.category.products.exclude(id=obj.id))

        if len(similar_products) >= 4:
            similar_products = random.sample(similar_products, 4)

        product_serializer = ProductDetailSerializer(similar_products, many=True)
        return product_serializer.data
