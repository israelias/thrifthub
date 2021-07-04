from django.db.models import Q
from django.shortcuts import get_object_or_404, render
from django.utils.text import slugify
from order.cart import Cart
from order.serializers import CartSerializer
from rest_framework import generics, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import models
from .models import Category, Product
from .serializers import (  # VendorAdminSerializer,; VendorProductSerializer,; VendorSerializer,
    CategorySerializer,
    ProductCartSerializer,
    ProductSerializer,
)


@api_view(["GET"])
def product(request, pk):
    instance = Product.objects.get(pk=pk)
    serializer = ProductCartSerializer(instance)
    return Response(serializer.data)


class ProductCartViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """

    def list(self, request):
        queryset = Product.objects.all()
        serializer = ProductSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, category_slug, product_slug, pk=None):
        queryset = Product.objects.all()
        cart = Cart(request)
        product = get_object_or_404(queryset, category__slug=category_slug, slug=product_slug, pk=pk)
        cart_serializer = CartSerializer()
        quantity = cart_serializer.cleaned_data["quantity"]
        cart.add(product_id=product.id, quantity=quantity, update_quantity=False)
        serializer = ProductCartSerializer(product)
        return Response(serializer.data)

    def create(self, request, category_slug, product_slug, pk=None):
        queryset = Product.objects.all()
        product = get_object_or_404(queryset, category__slug=category_slug, slug=product_slug, pk=pk)
        serializer = ProductCartSerializer(product)
        return Response(serializer.data)


class ProductCreateApi(generics.CreateAPIView):
    """
    Create a product.
    This API view supports only post requests.
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductApi(generics.ListAPIView):
    """
    Get a list of all vendors.
    This API view supports only get requests.
    """

    # queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned products to a given user,
        by filtering against a `query` query parameter in the URL.
        """
        queryset = Product.objects.all()
        query = self.request.query_params.get("query")
        if query is not None:
            queryset = queryset.filter(Q(title__icontains=query) | Q(description__icontains=query))
        return queryset


class ProductUpdateApi(generics.RetrieveUpdateAPIView):
    """
    Updating can be performed simply by replacing
    the ListAPIView with RetriveUpdateAPIView.
    This API view supports both get, put, and patch requests.
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDeleteApi(generics.DestroyAPIView):
    """
    Provides get and post method handlers
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductListView(generics.ListCreateAPIView):
    """
    Provides get and post method handlers
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user.vendor)


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Provides get, put, patch and delete method handlers
    """

    lookup_field = "slug"
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CategoryItemView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return models.Product.objects.filter(
            category__in=Category.objects.get(slug=self.kwargs["slug"]).get_descendants(include_self=True)
        )


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(level=1)
    serializer_class = CategorySerializer


# class VendorList(generics.ListCreateAPIView):
#     """
#     All Vendors
#     This API view supports post and get requests.
#     """

#     queryset = Vendor.objects.all()
#     serializer_class = VendorSerializer

#     """
#     Endpoint to become a vendor.
#     """

#     def perform_create(self, serializer):
#         serializer.save(name=self.request.user.username, created_by=self.request.user)


# class VendorDetail(generics.RetrieveUpdateDestroyAPIView):
#     """
#     Retrieve, update, delete a vendor.
#     """

#     queryset = Vendor.objects.all()
#     serializer_class = VendorAdminSerializer


# class VendorProductListView(generics.ListCreateAPIView):
#     """
#     Provides get and post method handlers
#     """

#     queryset = Product.objects.all()
#     serializer_class = VendorProductSerializer

#     def perform_create(self, serializer):
#         serializer.save(vendor=self.request.user)


# class VendorProductDetail(generics.RetrieveUpdateDestroyAPIView):
#     """
#     Provides get, put, patch and delete method handlers
#     """

#     lookup_field = "slug"
#     queryset = Product.objects.all()
#     serializer_class = VendorProductSerializer
