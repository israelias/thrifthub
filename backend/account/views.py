"""
Views for account app
register: Allows user to pick a username and password to create an account.
          Uses the default UserCreationForm from Django
          Automatically creates a vendor profile
"""

from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect, render
from knox.models import AuthToken
from rest_framework import generics, permissions
from rest_framework.response import Response
from vendor.models import Vendor
from vendor.serializers import CurrentVendorSerializer

from .serializers import AccountSerializer, AuthSerializer


class AccountDetail(generics.GenericAPIView):
    serializer_class = AccountSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        vendor = Vendor.objects.get(created_by=user)
        return Response(
            {
                "vendor": CurrentVendorSerializer(vendor, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


class AuthDetail(generics.GenericAPIView):
    serializer_class = AuthSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        vendor = Vendor.objects.get(created_by=user)
        return Response(
            {
                "vendor": CurrentVendorSerializer(vendor, context=self.get_serializer_context()).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )
