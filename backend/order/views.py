from django.shortcuts import render
from rest_framework import generics

from . import models
from .models import Order as OrderModel, OrderItem
from .serializers import OrderItemSerializer, OrderSerializer

from .cart import Cart


class OrderListView(generics.ListAPIView):
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer


class Order(generics.RetrieveAPIView):
    lookup_field = "id"
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer


class OrderItemListView(generics.ListAPIView):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


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
        order = OrderModel.objects.create(
            first_name=body["first_name"],
            last_name=body["last_name"],
            email=body["email"],
            address=body["address"],
            zipcode=body["zipcode"],
            place=body["place"],
            phone=body["phone"],
            paid_amount=body["paid_amount"],
        )

        for item in Cart(request):
            OrderItem.objects.create(
                order=order,
                product=item["product"],
                vendor=item["product"].vendor,
                price=item["product"].price,
                quantity=item["quantity"],
            )

            order.vendors.add(item["product"].vendor)

        return self.create(request, *args, **kwargs)
