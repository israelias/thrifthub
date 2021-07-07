from django.shortcuts import redirect, render, reverse
from django_filters.rest_framework import DjangoFilterBackend
from rest_flex_fields import FlexFieldsModelViewSet, is_expanded
from rest_framework import filters, generics, viewsets
from rest_framework.response import Response
from vendor.models import Vendor

from . import models
from .models import Category, Product
from .serializers import (
    CategoryFullSerializer,
    CategorySerializer,
    ProductCartSerializer,
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

    permit_list_expands = ["vendor", "image", "category", "product_image"]
    lookup_field = "slug"
    queryset = Product.objects.all()
    serializer_class = ProductVersatileSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description"]

    # api/?search=kicks
    # api/kicks/?expand=category,product_images

    # def get_queryset(self):
    #     queryset = models.Product.objects.all()
    #     if is_expanded(self.request, "category"):
    #         queryset = queryset.select_related("category")
    #     return queryset

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user.vendor)


class ProductsByVendorView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        return models.Product.objects.filter(vendor__in=models.Vendor.objects.get(slug=self.kwargs["slug"]))


class ProductsByCategory(generics.ListAPIView):

    serializer_class = ProductSerializer

    """
    Returns products under a single category in `slug`
    Endpoint: `api/store/category/<slug>`
    """

    def get_queryset(self):
        return models.Product.objects.filter(
            category__in=Category.objects.get(slug=self.kwargs["slug"]).get_descendants(include_self=True)
        )


class ProductsByCategories(generics.ListAPIView):
    serializer_class = ProductVersatileSerializer
    queryset = Product.objects.all()

    """
    Returns products hierarchically for every sub-category in `hierarchy` arg
    Endpoint: `api/store/category/<hierarchy>/<hierarchy/<hierarchy`
    where every node in the `MPTT` Category model is slug arguments that filters
    products per URL arg
    """

    def get_queryset(self):
        print("this", self.kwargs, self)
        category_slug = self.kwargs.get("hierarchy", None)
        parent = None
        root = Category.objects.all()

        print("this", category_slug)

        if category_slug is not None:
            category_slug = category_slug.split("/")

            for slug in category_slug[:-1]:
                print("next", slug)
                parent = Category.objects.get(parent=parent, slug=slug)

            try:
                instance = models.Product.objects.filter(
                    category__in=Category.objects.get(parent=parent, slug=category_slug[-1]).get_descendants(
                        include_self=True
                    )
                )
            except:

                instance = models.Product.objects.filter(
                    category__in=Category.objects.get(slug=category_slug[-1]).get_descendants(include_self=True)
                )
                print("except", instance)
                return instance
            else:
                print("else", instance)
                return instance
        print("last")
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

    # api/category/?search=kicks
    # add filters


class CategoryListView(generics.ListAPIView):
    """
    Returns all existing categories filtered from sub-parent, onwards
    """

    queryset = Category.objects.filter(level=1)

    # queryset = Category.objects.all()
    serializer_class = CategorySerializer
