import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render
from django.utils.text import slugify
from order.models import Order
from order.serializers import OrderSerializer
from rest_framework import generics, permissions, serializers, views, viewsets
from rest_framework.response import Response
from store.models import Product, ProductImage
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
    serializer_class = VendorAdminSerializer


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


# class VendorProduct(generics.ListCreateAPIView):
#     serializer_class = ProductSerializer
#     queryset = Product.objects.all()

#     def get_queryset(self):
#         vendor = Vendor.objects.get(id=self.kwargs["pk"])
#         products = get_object_or_404(self.queryset, vendor=vendor)
#         return products.products.all()

#     def post(self, request, pk):
#         vendor = Vendor.objects.get(id=pk)
#         products = get_object_or_404(self.queryset, vendor=vendor)
#         new_product = products.objects.get(id=request.data["product_id"])
#         if products:
#             products.products.add(new_product)
#         return Response(json.dumps({}))

#     def delete(self, request, pk):
#         vendor = Vendor.objects.get(id=pk)
#         products = get_object_or_404(self.queryset, vendor=vendor)
#         deleted_product = Product.objects.get(id=request.data["product_id"])
#         if products:
#             products.product.remove(deleted_product)
#         return Response(json.dumps({}))


# class VendorProductOrders(views.APIView):
#     serializer_class = VendorSerializer
#     queryset = Vendor.objects.all()

#     def get(self, request, format=None):
#         vendor = Vendor.objects.get(id=self.kwargs["pk"])
#         products = vendor.products.all()
#         orders = vendor.orders.all()

#         for order in orders:
#             order.vendor_amount = 0
#             order.vendor_paid_amount = 0
#             order.fully_paid = True

#             for item in order.items.all():
#                 if item.vendor == self.request.vendor:
#                     if item.vendor_paid:
#                         order.vendor_paid_amount += item.get_total_price()
#                     else:
#                         order.vendor_amount += item.get_total_price()
#                         order.fully_paid = False

#         return Response(json.dumps({"vendor": vendor, "products": products, "orders": orders}))

#     def post(self, request):
#         vendor = request.user.vendor
#         body = request.POST
#         product = Product.create(***body)

#         product.vendor = vendor
#         product.slug = slugify(product.title)
#         product.save()
#         favorites_obj = get_object_or_404(self.all_favorites, user=user)
#         recipe = Recipe.objects.get(id=request.data["recipe_id"])
#         if favorites_obj:
#             favorites_obj.favorites.add(recipe)
#         return Response(json.dumps({}))

#     def put(self, request, pk):
#         vendor = request.user.vendor
#         name = request.POST.get("name", "")
#         email = request.POST.get("email", "")

#         if name:
#             vendor.created_by.email = email
#             vendor.created_by.save()

#             vendor.name = name
#             vendor.save()

#         product.vendor = request.user.vendor
#         product.slug = slugify(product.title)
#         product.save()
#         favorites_obj = get_object_or_404(self.all_favorites, user=user)
#         recipe = Recipe.objects.get(id=request.data["recipe_id"])
#         if favorites_obj:
#             favorites_obj.favorites.add(recipe)
#         return Response(json.dumps({}))

#     def delete(self, request, pk):
#         user = User.objects.get(id=pk)
#         favorites_obj = get_object_or_404(self.all_favorites, user=user)
#         recipe = Recipe.objects.get(id=request.data["recipe_id"])
#         if favorites_obj:
#             favorites_obj.favorites.remove(recipe)
#         return Response(json.dumps({}))


# TRASH


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
