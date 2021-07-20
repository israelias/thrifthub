"""
Views for account app
register: Allows user to pick a username and password to create an account.
          Uses the default UserCreationForm from Django
          Automatically creates a vendor profile
"""
from django.contrib.auth.models import User
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, permissions, serializers, status, views
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import (
    AuthenticationFailed,
    InvalidToken,
    TokenBackendError,
    TokenError,
)
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)
from rest_framework_simplejwt.tokens import RefreshToken
from vendor.models import Vendor
from vendor.serializers import CurrentVendorSerializer

from .serializers import (
    AccountChangePasswordSerializer,
    AccountLoginSerializer,
    AccountRegisterSerializer,
    AccountUpdateSerializer,
    UserResponseSerializer,
)

test_param = openapi.Parameter("test", openapi.IN_QUERY, description="test manual param", type=openapi.TYPE_OBJECT)
user_response = openapi.Response("response description", UserResponseSerializer)


class AccountRegisterDetailView(generics.GenericAPIView):

    """
    Register endpoint.
    Returns access token and user's vendor data.

    """

    serializer_class = AccountRegisterSerializer
    permission_classes = (AllowAny,)

    @swagger_auto_schema(responses={200: user_response})
    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": CurrentVendorSerializer(user.vendor, context=self.get_serializer_context()).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


class AccountLoginDetailView(generics.GenericAPIView):
    """
    Login endpoint.
    Returns access token and user's vendor data.

    """

    serializer_class = AccountLoginSerializer
    queryset = User.objects.all()
    permission_classes = (AllowAny,)

    @swagger_auto_schema(responses={200: user_response})
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
   
        Vendor.objects.filter(created_by=user).update(online=True)

        return Response(
            {
                "user": CurrentVendorSerializer(user.vendor, context=self.get_serializer_context()).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )


class AccountChangePasswordView(generics.UpdateAPIView):
    """
    Change password endpoint and validation.

    """

    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = AccountChangePasswordSerializer


class AccountUpdateView(generics.UpdateAPIView):
    """
    Update account details.

    """

    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = AccountUpdateSerializer


class AccountLogoutView(views.APIView):
    """
    Logout with `refresh` in request body.

    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):

        try:

            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            Vendor.objects.filter(created_by=request.user).update(online=False)

            return Response(
                data={"message": "Successful Logout"},
                status=status.HTTP_200_OK,
            )
        except (TokenError, TokenBackendError):
            return Response(
                data={"message": "Token has already been blacklisted"}, status=status.HTTP_205_RESET_CONTENT
            )
        except InvalidToken:
            return Response(data={"message": "Token invalid"}, status=400)
        except AuthenticationFailed:
            return Response(data={"message": "Authentication failed"}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AccountLogoutAllView(views.APIView):
    """
    Logout from all devices.
    User is identified via `bearer token`

    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            tokens = OutstandingToken.objects.filter(user_id=request.user.id)
            for token in tokens:
                t, _ = BlacklistedToken.objects.get_or_create(token=token)

            Vendor.objects.filter(created_by=request.user).update(online=False)

            return Response(
                data={"message": "Successful Logout from all devices"},
                status=status.HTTP_200_OK,
            )
        except (TokenError, TokenBackendError):
            return Response(
                data={"message": "Token has already been blacklisted"}, status=status.HTTP_205_RESET_CONTENT
            )
        except InvalidToken:
            return Response(data={"message": "Token invalid"}, status=400)
        except AuthenticationFailed:
            return Response(data={"message": "Authentication failed"}, status=status.HTTP_401_UNAUTHORIZED)
