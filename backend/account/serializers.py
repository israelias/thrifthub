from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework import authentication
from django.contrib.auth.models import User
from rest_framework.response import Response
from .models import UserManager
from vendor.models import Vendor

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserManager
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data["username"], password=validated_data["password"],  )
        vendor = Vendor.objects.get(created_by=user)
        return vendor


class AuthSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
