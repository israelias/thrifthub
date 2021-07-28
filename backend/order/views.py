from django.shortcuts import render
from rest_flex_fields import FlexFieldsModelViewSet, is_expanded
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from store.models import Product

from . import models
from .models import Order as OrderModel
from .models import OrderDetail
from .serializers import OrderDetailSerializer, OrderSerializer


class OrderListView(generics.ListAPIView):
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (AllowAny,)


class VendorOrderViewSet(FlexFieldsModelViewSet):
    """
    Vendor Order View Set.
    With Flex-Expandable fields.
    With search fields.


    Flex Endpoint Options: `api/order/?expand=vendor,buyer,product`
    @see https://github.com/rsinger86/drf-flex-fieldshttps://github.com/rsinger86/drf-flex-fields

    Search Endpoint: `api/order/?search=<query>`

    Sample Request To Purchase or Make an Offer as a buyer:
    {
        "product": "1",
        "buyer": "4",
        "amount": "10.00",
        "access": <ACCESS TOKEN>,
        "refresh": <REFRESH TOKEN>
    }

    Status immediately updates to PROCESSING if amount is equal to product price.

    Sample Request To Accept or Deny an offer
    {
        "product": "1",
        "buyer": "4",
        "status": "ACCEPTED",

        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjI3OTc4MTYxLCJqdGkiOiI1ZGFiZjMzMmYwMzM0ZWQyOTliYzEzODdmMDRjODRiNSIsInVzZXJfaWQiOjF9.W-mkEE6A0YsznE2d1gSIUKViwDWvmH1-HiMm-YzwJltGfwQSNVZ9vQMfmzQEzyNYYzL6z3a7rVB8NWi7IEtP0A",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTYyNzk3ODE2MSwianRpIjoiMWUyNTY3OWVkMDlmNDM5NWJlODRkMjFlMDM4NWM3MTAiLCJ1c2VyX2lkIjoxfQ.DPduTSVmZwmb2lg_00d9mrhQ9NO3exMMPrqmm49hW0liuPQLqruLmGChkZXk4W03d_UwBl714ZltRX8yFZxugw"
    }



    """

    permit_list_expands = ["vendor", "product", "buyer"]
    lookup_field = "id"
    queryset = OrderModel.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (AllowAny,)


class VendorOrderDetailViewSet(FlexFieldsModelViewSet):
    """
    Vendor Order Detail View Set.
    With Flex-Expandable fields.


    List Endpont: `api/orderitem/`
    Detail Endpont: `api/orderitem/<id>`

    """

    lookup_field = "id"
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer
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
