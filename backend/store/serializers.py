import random

import order.models as order_models
import vendor.models as vendor_models
from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from versatileimagefield.serializers import VersatileImageFieldSerializer

from .models import Category, Image, Product


class CategorySerializer(serializers.ModelSerializer):
    products = serializers.StringRelatedField(many=True)

    class Meta:
        model = Category
        fields = ["name", "products", "slug"]


class VendorFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = vendor_models.Vendor
        fields = "__all__"


class VendorPreviewSerializer(serializers.ModelSerializer):
    order_count = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = vendor_models.Vendor
        fields = ["id", "name", "online", "image", "product_count", "order_count"]

    def get_order_count(self, obj):
        return order_models.Order.objects.filter(buyer=obj).count()

    def get_product_count(self, obj):
        return Product.objects.filter(vendor=obj).count()


class CategoryPreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name"]


class CategoryFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


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
    condition = serializers.CharField(source="get_condition_display")
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
            "condition",
            "created_at",
            "updated_at",
            "product_images",
        ]


class ProductHomeSerializer(FlexFieldsModelSerializer):
    # VIEW FOR ORDER ITEMS
    category = serializers.StringRelatedField(read_only=True)
    vendor = serializers.StringRelatedField(read_only=True)
    # condition = serializers.CharField(source="get_condition_display")
    # product_images = ImageNewSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "vendor",
            "title",
            "slug",
            "price",
            "condition",
            "is_available",
            "created_at",
            "updated_at",
            "image",
        ]
        expandable_fields = {
            "category": CategoryFullSerializer,
            "vendor": VendorFullSerializer,
            "image": ImageNewSerializer,
        }

    def get_image(self, obj):
        images = obj.product_images.all()[0]
        image_serializer = ImageNewSerializer(images)
        return image_serializer.data


class ProductPreviewSerializer(FlexFieldsModelSerializer):
    # VIEW FOR ORDER ITEMS
    category = serializers.StringRelatedField(read_only=True)
    vendor = serializers.StringRelatedField(read_only=True)
    image = serializers.SerializerMethodField()
    condition = serializers.CharField(source="get_condition_display")

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "vendor",
            "title",
            "slug",
            "price",
            "condition",
            "is_available",
            "image",
        ]
        expandable_fields = {
            "category": CategoryFullSerializer,
            "image": ImageNewSerializer,
            "vendor": VendorPreviewSerializer,
        }

    def get_image(self, obj):
        images = obj.product_images.all()[0]
        image_serializer = ImageNewSerializer(images)
        return image_serializer.data


class ProductSimilarSerializer(FlexFieldsModelSerializer):
    condition = serializers.CharField(source="get_condition_display")
    image = serializers.SerializerMethodField()
    category = CategoryPreviewSerializer()
    vendor = VendorPreviewSerializer()

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
            "condition",
            "image",
        ]
        expandable_fields = {
            "category": CategoryPreviewSerializer,
            "vendor": VendorPreviewSerializer,
            # "product_images": (ImageNewSerializer, {"many": True}),
        }

    def get_image(self, obj):
        images = obj.product_images.all()[0]
        image_serializer = ImageNewSerializer(images)
        return image_serializer.data


class ProductVersatileSerializer(FlexFieldsModelSerializer):
    similar_products = serializers.SerializerMethodField()
    condition = serializers.CharField(source="get_condition_display")
    absolute_url = serializers.CharField(source="get_absolute_url", read_only=True)
    image = serializers.SerializerMethodField()

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
            "condition",
            "is_available",
            "image",
            "product_images",
            "similar_products",
            "absolute_url",
            "created_at",
            "updated_at",
        ]
        expandable_fields = {
            "category": CategoryFullSerializer,
            "vendor": VendorPreviewSerializer,
            "product_images": (ImageNewSerializer, {"many": True}),
            # "similar_products": (serializers.SerializerMethodField, {"many": True}),
        }

    def get_similar_products(self, obj):
        similar_products = list(obj.category.products.exclude(id=obj.id))

        if len(similar_products) >= 4:
            similar_products = random.sample(similar_products, 4)

        product_serializer = ProductSimilarSerializer(similar_products, many=True)
        return product_serializer.data

    def get_image(self, obj):
        images = obj.product_images.all()[0]
        image_serializer = ImageNewSerializer(images)
        return image_serializer.data
