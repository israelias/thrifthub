from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from store.serializers import ProductSerializer, VendorFullSerializer

from .models import Order, OrderDetail


class OrderSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "product",
            "vendor",
            "buyer",
            "paid",
        ]
        expandable_fields = {
            "vendor": VendorFullSerializer,
            "buyer": VendorFullSerializer,
            "product": (ProductSerializer, {"many": True}),
        }


class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = "__all__"
