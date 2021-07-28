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
    VendorFavoritesSerializer,
    VendorFriendSerializer,
    VendorProductSerializer,
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
    permission_classes = (AllowAny,)


class OtherVendorDetailView(generics.RetrieveUpdateAPIView):
    """
    View another vendor's details.
    """

    queryset = Vendor.objects.all()
    serializer_class = CurrentVendorSerializer
    permission_classes = (AllowAny,)
    lookup_field = "id"


class VendorFavoriteListView(generics.ListCreateAPIView):
    """
    CRUD endpoints for a vendor's favorite products
    """

    # http://localhost:8000/api/vendor/1/favorites/?omit=similar_products

    serializer_class = ProductVersatileSerializer
    queryset = Favorite.objects.all()
    permission_classes = (AllowAny,)

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
