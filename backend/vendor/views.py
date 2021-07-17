import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render
from django.utils.text import slugify
from order.models import Order
from order.serializers import OrderSerializer
from rest_framework import (
    filters,
    generics,
    permissions,
    serializers,
    status,
    views,
    viewsets,
)
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.response import Response
from store.models import Favorite, Image, Product
from store.serializers import ProductSerializer, ProductVersatileSerializer

from . import models
from .models import Friend, Vendor
from .serializers import (
    CurrentVendorSerializer,
    OtherVendorSerializer,
    VendorAdminSerializer,
    VendorFavoritesSerializer,
    VendorFriendSerializer,
    VendorProductSerializer,
    VendorSearchSerializer,
    VendorSerializer,
)


class VendorDetailAuthView(generics.RetrieveAPIView):
    """
    This view should return the profile
    for the currently authenticated user.
    """

    permission_classes = [
        permissions.AllowAny,
    ]
    serializer_class = CurrentVendorSerializer

    def get_object(self):
        return self.request.user.vendor


class VendorDetailView(generics.RetrieveAPIView):
    """
    This view should return the profile
    for for vendor with matching id.
    """

    permission_classes = [
        permissions.AllowAny,
    ]
    serializer_class = CurrentVendorSerializer
    lookup_field = "id"
    queryset = Vendor.objects.all()


class VendorList(generics.ListAPIView):
    """
    All Vendors
    This API view supports get requests.
    Allows search.
    """

    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "slug"]


class OtherVendorDetailView(generics.RetrieveUpdateAPIView):
    """
    View another vendor's details.
    """

    queryset = Vendor.objects.all()
    serializer_class = OtherVendorSerializer
    lookup_field = "id"


class VendorListView(generics.ListAPIView):
    queryset = Vendor.objects.all()
    serializer_class = CurrentVendorSerializer


class VendorFavoriteListView(generics.ListCreateAPIView):
    """
    CRUD endpoints for a vendor's favorite products
    """

    # http://localhost:8000/api/vendor/1/favorites/?omit=similar_products

    serializer_class = ProductVersatileSerializer
    queryset = Favorite.objects.all()
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        vendor = Vendor.objects.get(id=self.kwargs["id"])
        favorites_obj = get_object_or_404(self.queryset, vendor=vendor)
        return favorites_obj.favorites.all()

    def post(self, request, id):
        vendor = Vendor.objects.get(id=id)
        favorites_obj = get_object_or_404(self.queryset, vendor=vendor)
        product = Product.objects.get(id=request.data["product_id"])
        if favorites_obj:
            favorites_obj.favorites.add(product)
        return Response(
            data={"message": "Added to Favorites"},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, id):
        vendor = Vendor.objects.get(id=id)
        favorites_obj = get_object_or_404(self.queryset, vendor=vendor)
        product = Product.objects.get(id=request.data["product_id"])
        if favorites_obj:
            favorites_obj.favorites.remove(product)
        return Response(
            data={"message": "Removed from Favorites"},
            status=status.HTTP_200_OK,
        )


class VendorFriendsListView(generics.ListCreateAPIView):
    """
    CRUD endpoints for a vendor's friends.
    """

    serializer_class = CurrentVendorSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    queryset = Friend.objects.all()

    def get_queryset(self):
        vendor = Vendor.objects.get(id=self.kwargs["id"])
        friends_obj = Friend.objects.get_or_create(current_vendor=vendor)
        return friends_obj.vendors.all()

    def post(self, request, id):
        vendor = Vendor.objects.get(id=id)
        friends_obj = Friend.objects.get_or_create(current_vendor=vendor)[0]
        friend = Vendor.objects.get(id=request.data["other_vendor_id"])
        if friends_obj:
            friends_obj.vendors.add(friend)
        return Response(
            data={"message": "Added to Friends"},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, id):
        vendor = Vendor.objects.get(id=id)
        friends_obj = Friend.objects.get_or_create(current_vendor=vendor)[0]
        friend = Vendor.objects.get(id=request.data["other_vendor_id"])
        if friends_obj:
            friends_obj.vendors.remove(friend)
        return Response(
            data={"message": "Removed from Friends"},
            status=status.HTTP_200_OK,
        )


class VendorSearchListView(generics.ListAPIView):
    """
    Endpoint for searching other vendors by name.
    """

    serializer_class = VendorSearchSerializer

    def get_queryset(self):
        query = self.kwargs["query"]
        queryset = Vendor.objects.filter(name__contains=query)
        return queryset


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
