from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from vendor.views import VendorDetailAuthView

from . import views

app_name = "account"

urlpatterns = [
    path(
        "account/login/",
        views.AccountLoginDetailView.as_view(),
        name="token_obtain_pair",
    ),
    # path("account/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("account/login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path(
        "account/register/",
        views.AccountRegisterDetailView.as_view(),
        name="account_register",
    ),
    path(
        "account/change_password/<int:pk>/",
        views.AccountChangePasswordView.as_view(),
        name="account_change_password",
    ),
    path(
        "account/update_profile/<int:pk>/",
        views.AccountUpdateView.as_view(),
        name="account_update_profile",
    ),
    path("account/logout/", views.AccountLogoutView.as_view(), name="account_logout"),
    path(
        "account/logout_all/",
        views.AccountLogoutAllView.as_view(),
        name="account_logout_all",
    ),
    path("account/user", VendorDetailAuthView.as_view(), name="account_user"),
    # path("account/register", views.AccountDetail.as_view(), "account_auth"),
    # path("account/login", views.AuthDetail.as_view(), "account_login"),
    # path("account/logout", LogoutView.as_view(), name="knox_logout"),
]
