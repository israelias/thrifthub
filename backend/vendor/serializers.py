import datetime

import order.models as order_models
import order.serializers as order_serializers
from django.conf import settings
from django.core.cache import cache
from django.db.models import Count, Q
from django.db.models.functions import Lower
from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from store import models as store_models
from store import serializers as store_serializers
from store.models import Category, Favorite, Image, Product
from store.serializers import ImageNewSerializer, ProductSerializer
from versatileimagefield.serializers import VersatileImageFieldSerializer

from .models import Friend, Vendor


class RawProductSlugSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        return obj.slug


class CurrentVendorSerializer(serializers.ModelSerializer):
    """
    Default Complete Vendor profile.
    Includes:
        A vendor's friends.
        A vendor's posted products.
        A vendor's friend's products.
        A vendor's favorite products.
        A vendor's orders as a seller.
        A vendor's orders as a buyer.
        A vendor's image.
    """

    friends = serializers.SerializerMethodField()
    products = serializers.SerializerMethodField()
    friends_products = serializers.SerializerMethodField()
    favorites = serializers.SerializerMethodField()
    order_requests = order_serializers.OrderFullSerializer(many=True, read_only=True)
    orders_made = order_serializers.OrderFullSerializer(many=True, read_only=True)
    order_count = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    image = VersatileImageFieldSerializer(
        sizes=[
            ("full_size", "url"),
            ("thumbnail", "thumbnail__100x100"),
        ]
    )

    class Meta:
        model = Vendor
        fields = [
            "id",
            "name",
            "created_at",
            "created_by",
            "products",
            "friends",
            "friends_products",
            "favorites",
            "image",
            "order_requests",
            "orders_made",
            "online",
            "order_count",
            "product_count",
        ]
        # extra_kwargs = {"image"}

    def get_friends(self, obj):
        try:
            friend = Friend.objects.get(current_vendor=obj)
            friends = friend.vendors.all()
        except:
            friends = None
            return []
        friends_serializer = VendorFriendSerializer(friends, many=True)
        return friends_serializer.data

    def get_products(self, obj):
        my_products = Product.objects.filter(vendor=obj.id).order_by(Lower("title"))
        product_serializer = ProductSerializer(my_products, many=True)
        return product_serializer.data

    def get_friends_products(self, obj):
        try:
            friend = Friend.objects.get(current_vendor=obj)
            friends = friend.vendors.all()
        except:
            friends = None
            return []
        friends_products = Product.objects.filter(vendor__in=friends).order_by("-created_at")
        product_serializer = ProductSerializer(friends_products, many=True)
        return product_serializer.data

    def get_favorites(self, obj):
        favorites, created = Favorite.objects.get_or_create(vendor=obj)
        favorite_products = obj.favorites.favorites.all()
        product_serializer = ProductSerializer(favorite_products, many=True)
        return product_serializer.data

    def get_order_count(self, obj):
        return order_models.Order.objects.filter(Q(vendor=obj) | Q(buyer=obj)).distinct().count()

    def get_product_count(self, obj):
        return Product.objects.filter(vendor=obj).count()


class OtherVendorSerializer(serializers.ModelSerializer):
    """
    A quick Preview of Another Vendor's profile.
    Includes:
        A vendor's products.
        A vendor's count of orders made as a buyer.
        A vendor's count of products posted.

    """

    products = serializers.SerializerMethodField()
    favorites = serializers.SerializerMethodField()
    order_count = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    order_requests = order_serializers.OrderFullSerializer(many=True, read_only=True)
    orders_made = order_serializers.OrderFullSerializer(many=True, read_only=True)

    image = VersatileImageFieldSerializer(
        sizes=[
            ("full_size", "url"),
            ("thumbnail", "thumbnail__100x100"),
        ]
    )

    class Meta:
        model = Vendor
        fields = [
            "id",
            "name",
            "created_at",
            "products",
            "favorites",
            "image",
            "order_requests",
            "orders_made",
            "online",
            "order_count",
            "product_count",
        ]

    def get_products(self, obj):
        their_products = Product.objects.filter(vendor=obj.id).order_by(Lower("title"))
        product_serializer = ProductSerializer(their_products, many=True)
        return product_serializer.data

    def get_order_count(self, obj):
        return order_models.Order.objects.filter(Q(vendor=obj) | Q(buyer=obj)).distinct().count()

    def get_product_count(self, obj):
        return Product.objects.filter(vendor=obj).count()

    def get_favorites(self, obj):
        favorites, created = Favorite.objects.get_or_create(vendor=obj)
        favorite_products = obj.favorites.favorites.all()
        product_serializer = ProductSerializer(favorite_products, many=True)
        return product_serializer.data


class VendorFavoritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class VendorFriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = "__all__"


class VendorProductFavoriteSlugPreview(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id"]


class VendorSerializer(serializers.ModelSerializer):
    products = ProductSerializer(read_only=True, many=True)
    orders_made = order_serializers.OrderSerializer(read_only=True, many=True)
    order_requests = order_serializers.OrderSerializer(read_only=True, many=True)
    created_by = serializers.StringRelatedField()
    order_count = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    favorites = serializers.SerializerMethodField()
    image = VersatileImageFieldSerializer(
        sizes=[
            ("full_size", "url"),
            ("thumbnail", "thumbnail__100x100"),
        ]
    )

    class Meta:
        model = Vendor
        fields = [
            "id",
            "name",
            "online",
            "products",
            "order_count",
            "product_count",
            "orders_made",
            "online",
            "order_requests",
            "favorites",
            "image",
            "created_at",
            "created_by",
            "slug",
        ]

    def get_order_count(self, obj):
        return order_models.Order.objects.filter(Q(vendor=obj) | Q(buyer=obj)).distinct().count()

    def get_product_count(self, obj):
        return Product.objects.filter(vendor=obj).count()

    def get_favorites(self, obj):
        favorites, created = Favorite.objects.get_or_create(vendor=obj)
        favorite_products = obj.favorites.favorites.all()
        product_serializer = RawProductSlugSerializer(favorite_products, many=True)
        return product_serializer.data


class VendorProductSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()
    vendor = VendorSerializer(read_only=True)
    product_images = ImageNewSerializer(many=True)

    class Meta:
        model = Product
        fields = "__all__"
        # fields = ["id", "category", "vendor", "title", "description", "slug", "regular_price", "product_image"]
