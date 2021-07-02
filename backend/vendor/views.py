from django.shortcuts import render
from rest_framework import generics

from . import models
from .models import Vendor
from .serializers import VendorSerializer


class VendorListView(generics.ListAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer


class Vendor(generics.RetrieveAPIView):
    lookup_field = "slug"
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer


# class CategoryItemView(generics.ListAPIView):
#     serializer_class = ProductSerializer

#     def get_queryset(self):
#         return models.Product.objects.filter(
#             category__in=Category.objects.get(slug=self.kwargs["slug"]).get_descendants(include_self=True)
#         )


# class CategoryListView(generics.ListAPIView):
#     queryset = Category.objects.filter(level=1)
#     serializer_class = CategorySerializer
