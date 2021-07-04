from rest_framework import serializers

# import vendor.serializers as vendor_serializers
# from vendor.serializers import VendorSerializer
from .models import Order, OrderItem
from .cart import Cart


class OrderSerializer(serializers.ModelSerializer):
    # vendors = VendorSerializer(many=True, read_only=True)
    vendors = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "first_name",
            "last_name",
            "email",
            "address",
            "zipcode",
            "place",
            "phone",
            "created_at",
            "paid_amount",
            "vendors",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    order = serializers.StringRelatedField()
    product = serializers.StringRelatedField()
    vendor = serializers.StringRelatedField()

    class Meta:
        model = OrderItem
        fields = ["order", "product", "vendor", "vendor_paid", "price", "quantity"]


class CartSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(default=0)
