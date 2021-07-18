from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers

# from django.core.exceptions import
from rest_framework.exceptions import MethodNotAllowed, NotFound
from rest_framework.validators import UniqueTogetherValidator
from store.models import Product
from store.serializers import ProductSerializer, VendorFullSerializer

from .models import Order, OrderDetail

available = ("OFFERED", "DENIED", "PENDING")
sold = ("PROCESSING", "ACCEPTED", "COMPLETED")


class OrderSerializer(FlexFieldsModelSerializer):
    status = serializers.CharField(source="get_status_display")

    class Meta:
        model = Order
        fields = ["id", "product", "vendor", "buyer", "status", "amount", "created_at"]
        expandable_fields = {
            "vendor": VendorFullSerializer,
            "buyer": VendorFullSerializer,
            "product": (ProductSerializer, {"many": True}),
        }
        # validators = [UniqueTogetherValidator(queryset=Order.objects.all(), fields=["buyer", "product"])]

    def validate(self, data):
        """
        Check if product is avaialable or if it is already in the buyer's orders.
        Ensure an offer is never more than the price of the product.
        """
        if self.context["request"]._request.method == "POST":

            if not data["product"].is_available:
                raise NotFound({"message": "This product is no longer available."})

            if Order.objects.filter(buyer=data["buyer"], product=data["product"]).exists():
                raise MethodNotAllowed({"message": "This product is already in your orders."})
            
        if float(data['amount']) > float(data['product'].price):
            raise MethodNotAllowed({"message": f"Your offer must not be greater than {data['product'].price}"})
        return data

    def create(self, validated_data):

        buyer = self.context["request"].user.vendor
        product = Product.objects.get(id=self.context["request"].data["product"])
        amount = validated_data.get("amount", product.price)
        instance = Order.objects.create(buyer=buyer, product=product, amount=amount)

        # if not product.is_available:
        #     return {"message": "This product is no longer available."}

        # if Order.objects.filter(buyer=buyer, product=product).exists():
        #     # return serializers.ValidationError({"message": "This product is already in your orders."})
        #     return MethodNotAllowed({"message": "This product is already in your orders."})

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


class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = "__all__"
