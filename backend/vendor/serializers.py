import order.models as order_models
import order.serializers as order_serializers
from rest_framework import serializers
from store import models as store_models
from store import serializers as store_serializers
from store.models import Category, Image, Product
from store.serializers import CategorySerializer, ImageNewSerializer, ProductSerializer

from .models import Vendor


class VendorSerializer(serializers.ModelSerializer):
    products = ProductSerializer(read_only=True, many=True)
    orders = order_serializers.OrderSerializer(read_only=True, many=True)
    created_by = serializers.StringRelatedField()

    class Meta:
        model = Vendor
        fields = ["name", "products", "orders", "created_at", "created_by", "slug"]

    # def create(self, validated_data):
    #     profile_data = validated_data.pop("profile")
    #     user = User.objects.create(**validated_data)
    #     Profile.objects.create(user=user, **profile_data)
    #     return user


class VendorAdminSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    orders = serializers.SerializerMethodField()

    class Meta:
        model = Vendor
        fields = ["name", "products", "orders", "created_at", "created_by", "slug"]

    def get_products(self, obj):
        vendor_products, created = Product.objects.get_or_create(vendor=obj)
        all_products = obj.products.products.all()
        product_serializer = ProductSerializer(all_products, many=True)
        return product_serializer.data

    def get_orders(self, obj):
        vendor_orders, created = order_models.Order.objects.get_or_create(user=obj)
        all_orders = obj.orders.orders.all()

        for order in all_orders:
            order.vendor_amount = 0
            order.vendor_paid_amount = 0
            order.fully_paid = True

            for item in order.items.all():
                if item.vendor == obj:
                    if item.vendor_paid:
                        order.vendor_paid_amount += item.get_total_price()
                    else:
                        order.vendor_amount += item.get_total_price()
                        order.fully_paid = False

        order_serializer = order_serializers.OrderSerializer(all_orders, many=True)
        return order_serializer.data


class VendorProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    vendor = VendorSerializer(read_only=True)
    product_images = ImageNewSerializer(many=True)

    class Meta:
        model = Product
        fields = ["id", "category", "vendor", "title", "description", "slug", "regular_price", "product_image"]

    def create(self, validated_data):
        images_data = validated_data.pop("product_image")
        category_data = validated_data.pop("category")
        product, created = Product.objects.get_or_create(**validated_data)
        if images_data:
            for image_data in images_data:
                Image.objects.create(product=product, **image_data)
        category, created = Category.objects.get_or_create(**category_data)
        return product
