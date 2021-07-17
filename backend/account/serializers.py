from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from drf_yasg import openapi
from rest_framework import authentication, serializers
from rest_framework.response import Response
from rest_framework.validators import UniqueValidator

from vendor.models import Vendor
from vendor.serializers import CurrentVendorSerializer


class UserResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = CurrentVendorSerializer()


class AccountRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print("SERIALIZER")
        user = User.objects.create_user(
            validated_data["username"],
            validated_data["email"],
            password=validated_data["password"],
        )
        # vendor = Vendor.objects.create(created_by=user, slug=user.username, name=user.username)
        return user


class AccountChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("old_password", "password")

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return value

    def update(self, instance, validated_data):
        user = self.context["request"].user

        if user.id != instance.id:
            raise serializers.ValidationError({"authorize": "You dont have permission for this user."})

        instance.set_password(validated_data["password"])
        instance.save()

        return instance


class AccountUpdateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "last_name", "email")
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def validate_email(self, value):
        user = self.context["request"].user
        if User.objects.exclude(id=user.id).filter(email=value).exists():
            raise serializers.ValidationError({"email": "This email is already in use."})
        return value

    def validate_username(self, value):
        user = self.context["request"].user
        if User.objects.exclude(id=user.id).filter(username=value).exists():
            raise serializers.ValidationError({"username": "This username is already in use."})
        return value

    def update(self, instance, validated_data):
        user = self.context["request"].user

        if user.id != instance.id:
            raise serializers.ValidationError({"authorize": "You dont have permission for this user."})

        instance.email = validated_data["email"]
        instance.username = validated_data["username"]

        instance.save()

        vendor = Vendor.objects.get(created_by=instance)
        vendor.name = instance.username.lower()
        vendor.slug = instance.username.lower()

        return instance


class AccountLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
