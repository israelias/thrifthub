from django.shortcuts import redirect, render, reverse
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
from .models import Category, Product, Image
from .serializers import (
    CategoryFullSerializer,
    CategorySerializer,
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

    # def list(self, request):
    #     pass

    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response({"Success": "msb blablabla"}, status=status.HTTP_201_CREATED, headers=headers)
    # def create(self, request, *args, **kwargs):
    #     serializer = self.get_serializer(data=request.data)
    #     if not serializer.is_valid(raise_exception=False):
    #         return Response({"Fail": "blablal", status=status.HTTP_400_BAD_REQUEST)

    #     self.perform_create(serializer)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response({"Success": "msb blablabla"}, status=status.HTTP_201_CREATED, headers=headers)

    # def retrieve(self, request, pk=None):
    #     pass

    # def update(self, request, pk=None):
    #     product_images = request.data("images", None)
    #     vendor = request.user.vendor
    #     current_images = Image.objects.get_or_create(product=vendor)[0]
    #     friend = Vendor.objects.get(id=request.data["other_vendor_id"])
    #     if friends_obj:
    #         friends_obj.vendors.add(friend)

    #     product_image_data = dict((self.context["request"].data).lists())["image"]

    #     instance = Product.objects.create(
    #         vendor=vendor,
    #         title=validated_data["title"],
    #         description=validated_data["description"],
    #         price=validated_data["price"],
    #         condition=validated_data["condition"],
    #         category=validated_data["category"],
    #     )

    #     instance.save()

    #     if product_image_data:
    #         for img_name in product_image_data:
    #             modified_data = Image.objects.create(product=instance, image=img_name)
    #             file_serializer = ImagePostSerializer(data=modified_data)
    #             if file_serializer.is_valid():
    #                 file_serializer.save()
    #     return Response(
    #         data={"message": "Added to Friends"},
    #         status=status.HTTP_200_OK,
    #     )

    # def post(self, request, id):
    #     vendor = Vendor.objects.get(id=id)
    #     favorites_obj = get_object_or_404(self.queryset, vendor=vendor)
    #     product = Product.objects.get(id=request.data["product_id"])
    #     if favorites_obj:
    #         favorites_obj.favorites.add(product)
    #     return Response(
    #         data={"message": "Added to Favorites"},
    #         status=status.HTTP_200_OK,
    #     )

    # def partial_update(self, request, pk=None):
    #     pass

    # def destroy(self, request, pk=None):
    #     pass


class ProductsByVendorView(generics.ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return models.Product.objects.filter(vendor=Vendor.objects.get(slug=self.kwargs["slug"]))


class ProductsByCategory(generics.ListAPIView):

    serializer_class = ProductSerializer
    permission_classes = (AllowAny,)

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
    permission_classes = (AllowAny,)

    """
    Returns products hierarchically for every sub-category in `hierarchy` arg
    Endpoint: `api/store/category/<hierarchy>/<hierarchy/<hierarchy`
    where every node in the `MPTT` Category model is slug arguments that filters
    products per URL arg
    """

    def get_queryset(self):

        category_slug = self.kwargs.get("hierarchy", None)
        parent = None
        root = Category.objects.all()

        if category_slug is not None:
            category_slug = category_slug.split("/")

            for slug in category_slug[:-1]:

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
