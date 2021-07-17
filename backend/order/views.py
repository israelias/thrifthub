from django.shortcuts import render
from rest_flex_fields import FlexFieldsModelViewSet, is_expanded
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from store.models import Product

from . import models
from .models import Order as OrderModel
from .models import OrderDetail
from .serializers import OrderDetailSerializer, OrderSerializer


class OrderListView(generics.ListAPIView):
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer


class VendorOrderViewSet(FlexFieldsModelViewSet):
    """
    Vendo Order View Set.
    With Flex-Expandable fields.
    With search fields.

    A viewset that provides default `create()`, `retrieve()`, `update()`,
    `partial_update()`, `destroy()` and `list()` actions.


    Flex Endpoint Options: `api/order/?expand=vendor,buyer,product`
    @see https://github.com/rsinger86/drf-flex-fieldshttps://github.com/rsinger86/drf-flex-fields

    Search Endpoint: `api/order/?search=<query>`
    Sample Request:
    {
        "product": "1",
        "buyer": "4",
        "amount": "10.00",
        "access": <ACCESS TOKEN>,
        "refresh": <REFRESH TOKEN>
    }

    """

    permit_list_expands = ["vendor", "product", "buyer"]
    lookup_field = "id"
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (AllowAny,)


class Order(generics.RetrieveAPIView):
    lookup_field = "id"
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer


class OrderItemListView(generics.ListAPIView):
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer


class OrderItem(generics.RetrieveAPIView):
    lookup_field = "id"
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer


class OrderItemCheckout(generics.CreateAPIView):
    """
    Checkout POST.
    """

    def post(self, request, *args, **kwargs):
        body = request.POST.get("body")
        order_item = OrderModel.objects.create(
            product=body["product"],
            vendor=body["product"].vendor,
            buyer=request.user.vendor,
        )
        order_detail = OrderDetail.objects.create(
            first_name=body["first_name"],
            last_name=body["last_name"],
            email=body["email"],
            address=body["address"],
            zipcode=body["zipcode"],
            country=body["country"],
            phone=body["phone"],
            amount=body["amount"],
            order=order_item,
        )

        return self.create(request, *args, **kwargs)
