import random

import order.models as order_models
import vendor.models as vendor_models
from django.db.models import Q
from django.utils.text import slugify
from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers, status
from rest_framework.response import Response
from versatileimagefield.serializers import VersatileImageFieldSerializer

from .models import Category, Favorite, Image, Product


class CategorySerializer(serializers.ModelSerializer):
    products = serializers.StringRelatedField(many=True)

    class Meta:
        model = Category
        fields = ["id", "name", "products", "slug"]


class VendorFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = vendor_models.Vendor
        fields = "__all__"


class RawProductSlugSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        return obj.slug


class RawIdSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        return obj.id


class VendorPreviewSerializer(serializers.ModelSerializer):
    order_count = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    favorites = serializers.SerializerMethodField()
    order_requests = serializers.SerializerMethodField()
    orders_made = serializers.SerializerMethodField()

    class Meta:
        model = vendor_models.Vendor
        fields = [
            "id",
            "name",
            "online",
            "image",
            "product_count",
            "order_count",
            "favorites",
            "order_requests",
            "orders_made",
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

    def get_order_requests(self, obj):
        order_requests = order_models.Order.objects.filter(vendor=obj)
        order_serializer = RawIdSerializer(order_requests, many=True)
        return order_serializer.data

    def get_orders_made(self, obj):
        orders_made = order_models.Order.objects.filter(buyer=obj)
        order_serializer = RawIdSerializer(orders_made, many=True)
        return order_serializer.data

    def get_product_count(self, obj):
        return Product.objects.filter(vendor=obj).count()


class CategoryPreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class CategoryFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class VendorSlugSerializer(serializers.ModelSerializer):
    class Meta:
        model = vendor_models.Vendor
        fields = ["id", "name", "slug"]


class ImagePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ("product", "image")


class ImageFullSerializer(FlexFieldsModelSerializer):
    image = VersatileImageFieldSerializer(
        sizes=[
            ("full_size", "url"),
            ("thumbnail", "thumbnail__240x180"),
        ]
    )

    class Meta:
        model = Image
        fields = ["image", "alt_text", "is_feature", "product", "created_at", "name", "id"]
        extra_kwargs = {
            "image": {"required": True},
        }

    def create(self, validated_data):
        instance = Image.objects.create(
            product=validated_data.get("product"),
            is_feature=validated_data.get("is_feature", False),
            image=validated_data.get("image"),
        )

        instance.save()

        return instance


class ImageNewSerializer(FlexFieldsModelSerializer):
    image = VersatileImageFieldSerializer(
        sizes=[
            ("full_size", "url"),
            ("thumbnail", "thumbnail__240x180"),
        ]
    )

    class Meta:
        model = Image
        fields = ["image", "alt_text", "is_feature", "id"]


class RawOrderStatusSerializer(serializers.BaseSerializer):
    def to_representation(self, obj):
        return obj.status


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    vendor = VendorSlugSerializer(read_only=True)
    condition = serializers.CharField(source="get_condition_display", read_only=True)
    product_images = ImageNewSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "vendor",
            "title",
            "description",
            "image",
            "slug",
            "price",
            "is_available",
            "condition",
            "created_at",
            "updated_at",
            "product_images",
        ]

    def get_image(self, obj):
        images = Image.objects.filter(product=obj).first()
        if not images:
            return {}
        image_serializer = ImageNewSerializer(images)
        return image_serializer.data.get("image")


class OrderedProductDetailSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = order_models.OrderDetail
        fields = "__all__"


class OrderedProductSerializer(FlexFieldsModelSerializer):
    buyer = VendorPreviewSerializer(read_only=True)
    product = ProductSerializer(read_only=True)
    # product = serializers.StringRelatedField()

    class Meta:
        model = order_models.Order
        fields = ["id", "buyer", "status", "product", "amount", "created_at", "updated_at", "order_detail"]
        expandable_fields = {
            # "buyer": VendorPreviewSerializer,
            # "product": ProductSerializer,
            "orderdetail": OrderedProductDetailSerializer,
        }


class ProductPreviewSerializer(FlexFieldsModelSerializer):
    # VIEW FOR ORDER ITEMS
    category = serializers.StringRelatedField(read_only=True)
    vendor = serializers.StringRelatedField(read_only=True)
    image = serializers.SerializerMethodField(read_only=True)
    condition = serializers.CharField(source="get_condition_display", read_only=True)

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
            "created_at",
            "updated_at",
        ]
        expandable_fields = {
            "category": CategoryFullSerializer,
            "image": ImageNewSerializer,
            "vendor": VendorPreviewSerializer,
        }

    def get_image(self, obj):
        images = Image.objects.filter(product=obj).first()
        if images:
            image_serializer = ImageNewSerializer(images)
            return image_serializer.data.get("image")
        return image_serializer.data


class ProductSimilarSerializer(FlexFieldsModelSerializer):
    condition = serializers.CharField(source="get_condition_display", read_only=True)
    image = serializers.SerializerMethodField(read_only=True)
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
            "created_at",
            "updated_at",
        ]
        expandable_fields = {
            "category": CategoryPreviewSerializer,
            "vendor": VendorPreviewSerializer,
        }

    def get_image(self, obj):
        images = Image.objects.filter(product=obj).first()
        if images:
            image_serializer = ImageNewSerializer(images)
            return image_serializer.data.get("image")
        return image_serializer.data


class ProductVersatileSerializer(FlexFieldsModelSerializer):
    similar_products = serializers.SerializerMethodField()
    absolute_url = serializers.CharField(source="get_absolute_url", read_only=True)
    image = serializers.SerializerMethodField(read_only=True)
    # product_images = serializers.SerializerMethodField()
    # ordered_product = OrderedProductSerializer(many=True, read_only=True)

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
            "ordered_product",
        ]
        expandable_fields = {
            "category": CategoryFullSerializer,
            "vendor": VendorPreviewSerializer,
            "product_images": (ImageNewSerializer, {"many": True}),
            "ordered_product": (OrderedProductSerializer, {"many": True}),
        }
        extra_kwargs = {
            "product_images": {"required": False},
            "is_available": {"required": False},
            "ordered_product": {"required": False},
        }

    def get_similar_products(self, obj):
        similar_products = list(obj.category.products.exclude(id=obj.id))

        if len(similar_products) >= 4:
            similar_products = random.sample(similar_products, 4)

        product_serializer = ProductSimilarSerializer(similar_products, many=True)
        return product_serializer.data

    def get_image(self, obj):
        images = Image.objects.filter(product=obj).first()
        if images:
            image_serializer = ImageNewSerializer(images)
            return image_serializer.data.get("image")
        return image_serializer.data

    def create(self, validated_data):
        vendor = self.context["request"].user.vendor

        print("images field", self.context["request"].data["images"])

        product_image_data = dict((self.context["request"].data).lists())["images"]

        print("images as dict", product_image_data)

        instance = Product.objects.create(
            vendor=vendor,
            title=validated_data["title"],
            description=validated_data["description"],
            price=validated_data["price"],
            condition=validated_data["condition"],
            category=validated_data["category"],
        )

        instance.save()

        if product_image_data:
            for img_name in product_image_data:
                print("each item in images", img_name)
                modified_data = Image.objects.create(product=instance, image=img_name)
                file_serializer = ImagePostSerializer(data=modified_data)
                if file_serializer.is_valid():
                    file_serializer.save()

        return instance

    def update(self, instance, validated_data):
        request = self.context["request"]
        vendor = request.user.vendor

        # Check if there is an images field
        images_request = request.data.get("images", None)
        print("new", images_request)

        # Find current images attached to the product
        current_images = Image.objects.filter(product=instance)
        print("existing", current_images)

        # If there is data, they would be new
        to_remove = []
        if images_request:
            for img in dict((request.data).lists())["images"]:
                new_image = Image.objects.create(product=instance, image=img)
                image_serializer = ImagePostSerializer(data=new_image)
                if image_serializer.is_valid():
                    print("herreee?")
                    image_serializer.save()
                to_remove.append(new_image.id)
                print("appended", new_image)

        # Update any fields to the validated args, else keep the previous value
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.price = validated_data.get("price", instance.price)
        instance.condition = validated_data.get("condition", instance.condition)
        instance.category = validated_data.get("category", instance.category)

        # Finally save the updates to the produuct
        instance.save()
        print("saved additions", instance.product_images.all())

        # To know if other images were removed,
        # deleted_images = Image.objects.filter(id=instance.id)

        # And then deal with destroying the images no longer attached to the product
        print("LIST", to_remove)
        if len(to_remove) > 0:
            for img in list(instance.product_images.exclude(id__in=to_remove)):
                print("here?", list(instance.product_images.exclude(id__in=to_remove)))
                old_image = Image.objects.get(id=img.id)
                print("herrrr", old_image)
                old_image.delete()

        return instance
