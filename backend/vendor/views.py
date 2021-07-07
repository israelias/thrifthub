import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render
from django.utils.text import slugify
from order.models import Order
from order.serializers import OrderSerializer
from rest_framework import generics, permissions, serializers, views, viewsets
from rest_framework.response import Response
from store.models import Image, Product
from store.serializers import ProductSerializer

from . import models
from .models import Vendor
from .serializers import (
    VendorAdminSerializer,
    VendorProductSerializer,
    VendorSerializer,
)


class VendorList(generics.ListCreateAPIView):
    """
    All Vendors
    This API view supports post and get requests.
    """

    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

    """
    Endpoint to become a vendor.
    """

    def perform_create(self, serializer):
        serializer.save(name=self.request.user.username, created_by=self.request.user)


class VendorDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, delete a vendor.
    """

    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer


class VendorProductListView(generics.ListCreateAPIView):
    """
    Provides get and post method handlers
    """

    queryset = Product.objects.all()
    serializer_class = VendorProductSerializer

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)


class VendorProductDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Provides get, put, patch and delete method handlers
    """

    lookup_field = "slug"
    queryset = Product.objects.all()
    serializer_class = VendorProductSerializer


class VendorProductCreateApi(generics.CreateAPIView):
    """
    Create a product as a vendor.
    This API view supports only post requests.
    """

    queryset = Product.objects.all()
    serializer_class = VendorProductSerializer


class VendorProductApi(generics.ListAPIView):
    """
    Get a list of all products.
    This API view supports only get requests.
    """

    queryset = Product.objects.all()
    serializer_class = VendorProductSerializer


class VendorProductUpdateApi(generics.RetrieveUpdateAPIView):
    """
    Updating can be performed simply by replacing
    the ListAPIView with RetriveUpdateAPIView.
    This API view supports both get, put, and patch requests.
    """

    queryset = Product.objects.all()
    serializer_class = VendorProductSerializer


class VendorProductDeleteApi(generics.DestroyAPIView):
    """
    Delete a Vendor.
    This API view provides only delete requests
    """

    queryset = Product.objects.all()
    serializer_class = VendorProductSerializer
