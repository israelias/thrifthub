from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from vendor.models import Vendor
from vendor.serializers import CurrentVendorSerializer


class UserResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    user = CurrentVendorSerializer()


class AccountRegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data: dict) -> User:
        """
        The create function creates a new user and returns the user object.

        Args:
            self: Refer to the object that is being created
            validated_data: Pass in the dictionary of validated data from our serializer

        Returns:
            The user object that was created
        """
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

    def validate_old_password(self, value: str) -> str:
        """
        The validate_old_password function is a validator that checks to see if the old password provided by the user
        matches with what is in the database. If it does not match, then an error message will be returned.

        Args:
            self: Access the class itself
            value: Validate the password

        Returns:
            The value that was passed in
        """
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                {"old_password": "Old password is not correct"}
            )
        return value

    def update(self, instance, validated_data: dict) -> User:
        """
        The update function is used to change the password of a user.
        It takes in an instance and validated_data as arguments.
        The user is authenticated using the token provided by the request header,
        and if it matches with that of the current logged in user, then only he/she can update his/her password.

        Args:
            self: Access the class itself
            instance: Pass in the instance being updated
            validated_data: Store the validated data

        Returns:
            The updated user
        """
        user = self.context["request"].user

        if user.id != instance.id:
            raise serializers.ValidationError(
                {"authorize": "You dont have permission for this user."}
            )

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

    def validate_email(self, value: str) -> str:
        """
        The validate_email function checks to see if the email entered is already in use by another user.
        If it is, then a ValidationError will be raised and the error message &quot;This email is already in use.&quot;
        will be displayed. If not, then the value will be returned as expected.

        Args:
            self: Access the class object within a class method
            value: Validate the email address

        Returns:
            The value of the email field
        """
        user = self.context["request"].user
        if User.objects.exclude(id=user.id).filter(email=value).exists():
            raise serializers.ValidationError(
                {"email": "This email is already in use."}
            )
        return value

    def validate_username(self, value: str) -> str:
        """
        The validate_username function checks to see if the username is already in use.
        It does this by excluding the current user from the list of users that have a username
        equal to value, and then checking if there are any users left. If there are, it raises
        a validation error.

        Args:
            self: Access the class that is calling the function
            value: Validate the value of a field

        Returns:
            The value of the username field if it is not already in use by another user
        """
        user = self.context["request"].user
        if User.objects.exclude(id=user.id).filter(username=value).exists():
            raise serializers.ValidationError(
                {"username": "This username is already in use."}
            )
        return value

    def update(self, instance, validated_data: dict) -> User:
        """
        The update function is used to update the user's email and username.
        It also updates the vendor name and slug with the username.

        Args:
            self: Access the class itself
            instance: Pass in the object that is being modified
            validated_data: Pass the data that has been validated by the serializer

        Returns:
            The updated user object
        """
        user = self.context["request"].user

        if user.id != instance.id:
            raise serializers.ValidationError(
                {"authorize": "You dont have permission for this user."}
            )

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

    def validate(self, data: dict) -> dict:
        """
        The validate function is called on every request regardless of whether the endpoint requires
        authorization. It is used to validate that the user has provided valid credentials, and if so,
        the function returns a User object. If not, it raises an exception which causes an HTTP 403 error.

        Args:
            self: Access the attributes and methods of the class
            data: Pass the data to be validated

        Returns:
            The user object if the credentials are correct and the user is active
        """
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
