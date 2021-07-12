from django.shortcuts import render
from rest_framework import generics

from . import models
from .models import Order as OrderModel
from .models import OrderDetail
from .serializers import OrderDetailSerializer, OrderSerializer


class OrderListView(generics.ListAPIView):
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer


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

        # for item in Cart(request):
        #     OrderItem.objects.create(
        #         order=order,
        #         product=item["product"],
        #         vendor=item["product"].vendor,
        #         price=item["product"].price,
        #         quantity=item["quantity"],
        #     )

        #     order.vendors.add(item["product"].vendor)

        return self.create(request, *args, **kwargs)
