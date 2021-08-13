from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from rest_framework.exceptions import MethodNotAllowed, NotFound
from rest_framework.response import Response
from rest_framework.validators import UniqueTogetherValidator
from store.models import Product
from store.serializers import (
    CategoryPreviewSerializer,
    ProductPreviewSerializer,
    ProductSerializer,
    ProductVersatileSerializer,
    VendorFullSerializer,
    VendorPreviewSerializer,
)
from vendor.models import Vendor

from .models import Order, OrderDetail

available = ("OFFERED", "DENIED", "PENDING")
sold = ("PROCESSING", "ACCEPTED", "COMPLETED")


class OrderPreviewSerializer(serializers.ModelSerializer):
    vendor = VendorPreviewSerializer(read_only=True)
    buyer = VendorPreviewSerializer(read_only=True)
    product = ProductPreviewSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ["id", "product", "vendor", "buyer", "status", "amount", "created_at", "updated_at"]


class OrderDetailSerializer(FlexFieldsModelSerializer):
    # order = OrderPreviewSerializer(read_only=True)

    class Meta:
        model = OrderDetail
        fields = [
            "id",
            "full_name",
            "email",
            "phone_number",
            "country",
            "zipcode",
            "town_or_city",
            "street_address1",
            "street_address2",
            "county",
            "created_at",
            "updated_at",
            "stripe_pid",
            "order",
        ]


class OrderDetailReadSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = OrderDetail
        fields = "__all__"


class OrderFullSerializer(serializers.ModelSerializer):
    vendor = VendorPreviewSerializer(read_only=True)
    buyer = VendorPreviewSerializer(read_only=True)
    product = ProductPreviewSerializer(read_only=True)
    order_detail = OrderDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "product", "vendor", "buyer", "status", "amount", "created_at", "updated_at", "order_detail"]


class OrderSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = Order
        fields = ["id", "product", "vendor", "buyer", "status", "amount", "created_at", "updated_at", "order_detail"]
        expandable_fields = {
            "vendor": VendorPreviewSerializer,
            "buyer": VendorPreviewSerializer,
            "product": ProductPreviewSerializer,
            "order_detail": OrderDetailReadSerializer,
        }
        extra_kwargs = {"amount": {"required": False}, "order_detail": {"required": False}}

    def validate(self, data):
        """
        Check if product is avaialable or if it is already in the buyer's orders.
        Ensure an offer is never more than the price of the product.
        """
        # If it's a post request
        instance = getattr(self, "instance", None)
        print("instance", instance)
        if self.context["request"]._request.method == "POST":

            # Reject offer if buyer has already have a standing offer for the product
            if Order.objects.filter(buyer=data["buyer"], product=data["product"]).exists():
                raise MethodNotAllowed({"message": "This product is already in your orders."})

            # Ensure the first offer is never more than the price of the product
            if float(data["amount"]) > float(data["product"].price):
                raise MethodNotAllowed({"message": f"Your offer must not be greater than {data['product'].price}"})

        if self.context["request"]._request.method == "PUT":
            # Ensure updates to offer amounts are validated only on put requests
            if self.context["request"].user.vendor == instance.buyer:
                if float(data["amount"]) > float(data["product"].price):
                    raise MethodNotAllowed({"message": f"Your offer must not be greater than {data['product'].price}"})

        # Reject offer if product is no longer available
        if not data["product"].is_available:
            raise NotFound({"message": "This product is no longer available."})

        return data

    def create(self, validated_data):
        request = self.context["request"]
        buyer = request.user.vendor
        # buyer = Vendor.objects.get(created_by=request.user.vendor)

        product = Product.objects.get(id=request.data.get("product"))
        amount = validated_data.get("amount", product.price)
        instance = Order.objects.create(buyer=buyer, product=product, amount=amount)

        if float(instance.amount) < float(product.price):
            instance.status = "OFFERED"
        if float(instance.amount) == float(product.price):
            instance.status = "PROCESSING"

        if instance.status == "PROCESSING":
            # Mark product as no longer available
            Product.objects.filter(id=instance.product.id).update(is_available=False)

        if instance.status == "OFFERED":
            # Mark product as still available
            Product.objects.filter(id=instance.product.id).update(is_available=True)

        instance.save()

        return instance

    def update(self, instance, validated_data):

        user = self.context["request"].user.vendor

        product_data = validated_data["product"]
        product = Product.objects.get(id=product_data.id)

        if user == instance.vendor:
            # seller can update status
            print("request is from vendor")
            instance.status = validated_data.get("status", instance.status)
            print("result", instance.status)

        if user == instance.buyer:
            # buyer can update amount
            instance.amount = validated_data.get("amount", instance.amount)

            if float(instance.amount) < float(product.price):
                instance.status = "OFFERED"

            if float(instance.amount) == float(product.price):
                instance.status = "PROCESSING"

        instance.save()

        if instance.status in sold:
            # Mark product as no longer available
            product.is_available = False
            product.save()
            instance.product.is_available = False

        if instance.status in available:
            # Mark product as available
            product.is_available = True
            product.save()
            instance.product.is_available = True

        instance.product.save()
        return instance
