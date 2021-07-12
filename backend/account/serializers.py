from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import authentication, serializers
from rest_framework.response import Response
from vendor.models import Vendor

from .models import UserManager


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print("SERIALIZER")
        user = User.objects.create_user(
            validated_data["username"],
            password=validated_data["password"],
        )
        vendor = Vendor.objects.create(created_by=user, slug=user.username, name=user.username)
        return user


class AuthSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
