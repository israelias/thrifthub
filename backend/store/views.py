from django.shortcuts import get_object_or_404, redirect, render, reverse
from django_filters.rest_framework import DjangoFilterBackend
from rest_flex_fields import FlexFieldsModelViewSet, is_expanded
from rest_framework import filters, generics, viewsets
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.response import Response
from vendor.models import Vendor

from . import models
from .models import Category, Image, Product
from .serializers import (
    CategoryFullSerializer,
    CategorySerializer,
    ImageFullSerializer,
    ProductSerializer,
    ProductVersatileSerializer,
)


class ProductViewSet(FlexFieldsModelViewSet):
    """
    Product View Set.
    With Flex-Expandable fields.
    With search fields.

    Flex Endpoint Options: `api/store/?expand=category,product_images`
    @see https://github.com/rsinger86/drf-flex-fieldshttps://github.com/rsinger86/drf-flex-fields

    Search Endpoint: `api/store/?search=<query>`

    """

    permit_list_expands = ["vendor", "image", "category", "product_images"]
    lookup_field = "slug"
    queryset = Product.objects.all()
    serializer_class = ProductVersatileSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description"]
    permission_classes = (AllowAny,)


class ProductImagesViewSet(FlexFieldsModelViewSet):
    """
    Images Viewset
    """

    # http://localhost:8000/api/vendor/1/favorites/?omit=similar_products

    serializer_class = ImageFullSerializer
    queryset = Image.objects.all()
    permission_classes = (AllowAny,)


class ProductImagesByProductId(generics.ListAPIView):

    serializer_class = ImageFullSerializer
    permission_classes = (AllowAny,)

    """
    Returns product images that share product `id`
    Endpoint: `api/store/images/<id>`
    """

    def get_queryset(self):
        """
        The get_queryset function is used to return a QuerySet of all the images associated with the product.
        The get_queryset function takes in self, which represents an instance of ProductDetailView and returns a QuerySet
        of all the images associated with that particular product.

        Args:
            self: Reference the class itself

        Returns:
            The images of the product with the id passed in
        """
        return Image.objects.filter(product=self.kwargs["id"])


class ProductsByVendorView(generics.ListAPIView):
    serializer_class = ProductSerializer
    # queryset = Product.objects.all()
    permission_classes = (AllowAny,)

    """
    Returns product that share vendor `slug`
    Endpoint: `api/store/vendor/<slug>`
    """

    def get_queryset(self):
        return Product.objects.filter(
            vendor=Vendor.objects.get(slug=self.kwargs["slug"])
        )


class ProductsByCategory(generics.ListAPIView):

    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

    """
    Returns products under a single category in `slug`
    Endpoint: `api/store/category/<slug>`
    """

    def get_queryset(self):
        """
        The get_queryset function is a Django shortcut that allows you to return the queryset of objects for a given model.
        It takes one argument, which is the viewset class itself (in this case, it's ProductListView).
        The get_queryset function returns all of the products in a category and its descendants.

        Args:
            self: Access the attributes and methods of the class in python

        Returns:
            A queryset of all the products in a category
        """
        return models.Product.objects.filter(
            category__in=Category.objects.get(slug=self.kwargs["slug"]).get_descendants(
                include_self=True
            )
        )


class ProductsByCategories(generics.ListAPIView):
    serializer_class = ProductVersatileSerializer
    queryset = Product.objects.all()
    permission_classes = (AllowAny,)

    """
    Returns products hierarchically for every sub-category in `hierarchy` arg
    Endpoint: `api/store/category/<hierarchy>/<hierarchy/<hierarchy`
    where every node in the `MPTT` Category model is slug arguments that filters
    products per URL arg
    """

    def get_queryset(self):
        """
        The get_queryset function is used to return a filtered queryset of products.
        It takes the kwargs from the URL as input and returns a filtered queryset.
        The category_slug variable is created by taking the value of 'hierarchy' from
        the URL keyword arguments, splitting it on '/', and then creating a list with
        all but the last item in that list (which would be our slug). This allows us to
        iterate through all parent categories until we find our slug, which we use to filter.

        Args:
            self: Refer to the instance of the class

        Returns:
            The queryset of the products that are related to the category slug
        """

        category_slug = self.kwargs.get("hierarchy", None)
        parent = None
        root = Category.objects.all()

        if category_slug is not None:
            category_slug = category_slug.split("/")

            for slug in category_slug[:-1]:

                parent = Category.objects.get(parent=parent, slug=slug)

            try:
                instance = models.Product.objects.filter(
                    category__in=Category.objects.get(
                        parent=parent, slug=category_slug[-1]
                    ).get_descendants(include_self=True)
                )
            except:

                instance = models.Product.objects.filter(
                    category__in=Category.objects.get(
                        slug=category_slug[-1]
                    ).get_descendants(include_self=True)
                )

                return instance
            else:

                return instance

        redirect(reverse("product-list"))


class CategoryViewSet(FlexFieldsModelViewSet):
    """
    View set for Category Crud operations
    With Flex-Expandable fields.
    With search fields.

    Flex Endpoint Options: `api/category/?
    @see https://github.com/rsinger86/drf-flex-fieldshttps://github.com/rsinger86/drf-flex-fields
    """

    lookup_field = "slug"
    queryset = Category.objects.all()
    serializer_class = CategoryFullSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name"]
    permission_classes = (AllowAny,)


class CategoryListView(generics.ListAPIView):
    """
    Returns all existing categories filtered from sub-parent, onwards
    """

    queryset = Category.objects.filter(level=1)
    permission_classes = (AllowAny,)

    # queryset = Category.objects.all()
    serializer_class = CategorySerializer
