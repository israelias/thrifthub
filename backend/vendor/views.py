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

    def get_object(self) -> Vendor:
        """
        The get_object function is used to retrieve the object that the view will
        render to JSON. In this case, it returns a vendor instance based on the primary
        key provided in the URL.

        Args:
            self: Access the attributes and methods of the class

        Returns:
            The vendor object of the user who is currently logged in
        """
        return self.request.user.vendor


class VendorDetailView(generics.RetrieveAPIView):
    """
    This view should return the profile
    for vendor with matching id.
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

    def get_queryset(self) -> list:
        """
        The get_queryset function is used to return a QuerySet of all the favorites for a particular vendor.
        It takes in the id of the vendor as an argument, and then uses that id to filter through all of our
        Favorites objects. It returns only those Favorites objects which have been associated with that particular
        vendor.

        Args:
            self: Access the attributes and methods of the class

        Returns:
            The favorites of a particular vendor
        """
        vendor = Vendor.objects.get(id=self.kwargs["id"])
        favorites_obj = get_object_or_404(self.queryset, vendor=vendor)
        return favorites_obj.favorites.all()

    def post(self, request, id) -> Response:
        """
        The post function allows the user to add a product to their favorites list.
        It takes in an id of a vendor and the id of a product, and adds that product
        to the favorites list for that vendor.

        Args:
            self: Reference the class itself
            request: Get the product id from the post request
            id: Get the vendor object from the database

        Returns:
            A message that the product was added to favorites
        """
        vendor = Vendor.objects.get(id=id)
        favorites_obj = get_object_or_404(self.queryset, vendor=vendor)
        product = Product.objects.get(id=request.data["product_id"])
        if favorites_obj:
            favorites_obj.favorites.add(product)
        return Response(
            data={"message": "Added to Favorites"},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, id) -> Response:
        """
        The delete function is used to remove a product from the favorites list of a vendor.
        It takes in an id for the vendor and an id for the product as parameters. It then finds
        the corresponding vendor and favorite object, removes that product from favorites, and
        returns a message indicating that it was removed.

        Args:
            self: Reference the class of the object that is calling this function
            request: Get the id of the product that is being removed from favorites
            id: Get the vendor object from the database

        Returns:
            The response message that the product has been removed from favorites
        """
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

    def get_queryset(self) -> list:
        """
        The get_queryset function is used to return a QuerySet of all the vendors that are friends with the vendor
        that owns this view. This function is called by Django when it needs to retrieve data for this view.

        Args:
            self: Reference the current instance of the class

        Returns:
            All the vendors that are friends with the vendor whose id matches self
        """
        vendor = Vendor.objects.get(id=self.kwargs["id"])
        friends_obj = Friend.objects.get_or_create(current_vendor=vendor)
        return friends_obj.vendors.all()

    def post(self, request, id) -> Response:
        """
        The post function allows a vendor to add another vendor as a friend.
        It takes the id of the current vendor and the other_vendor_id, which is
        the id of the other user that will be added as a friend.

        Args:
            self: Reference the class itself
            request: Get the data from the request
            id: Get the vendor object from the database

        Returns:
            A response with a message and status code
        """
        vendor = Vendor.objects.get(id=id)
        friends_obj = Friend.objects.get_or_create(current_vendor=vendor)[0]
        friend = Vendor.objects.get(id=request.data["other_vendor_id"])
        if friends_obj:
            friends_obj.vendors.add(friend)
        return Response(
            data={"message": "Added to Friends"},
            status=status.HTTP_200_OK,
        )

    def delete(self, request, id) -> Response:
        """
        The delete function is used to remove a vendor from the friends list of another vendor.
        It takes in an id for the current_vendor and then removes that vendor from the other_vendor's friends list.

        Args:
            self: Access variables that belongs to the class
            request: Get the other vendor id
            id: Find the vendor with the given id
        """
        vendor = Vendor.objects.get(id=id)
        friends_obj = Friend.objects.get_or_create(current_vendor=vendor)[0]
        friend = Vendor.objects.get(id=request.data["other_vendor_id"])
        if friends_obj:
            friends_obj.vendors.remove(friend)
        return Response(
            data={"message": "Removed from Friends"},
            status=status.HTTP_200_OK,
        )
