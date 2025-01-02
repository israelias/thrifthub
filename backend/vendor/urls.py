from django.urls import path

from . import views

app_name = "vendor"

urlpatterns = [
    path("vendor/home/<id>", views.VendorDetailView.as_view()),
    # includes favorites, and friends' products
    path("vendor/", views.VendorList.as_view(), name="vendors_profiles"),
    path("vendor/<id>/", views.OtherVendorDetailView.as_view()),
    path("vendor/<id>/favorites/", views.VendorFavoriteListView.as_view()),
    path("vendor/<id>/friends/", views.VendorFriendsListView.as_view()),
    # previous
    # path("vendors/<int:pk>/", views.VendorDetail.as_view(), name="vendor_profile"),
    # path("vendors/profile/", views.VendorProductListView.as_view(), name="vendors_profiles_test"),
    # path("vendors/profile/<int:pk>/", views.VendorProductDetail.as_view(), name="vendor_profile_test"),
    # path("vendors/products", views.VendorProductApi.as_view(), name="vendor_product_get"),
    # path("vendors/products/create", views.VendorProductCreateApi.as_view(), name="vendor_product_create"),
    # path("vendors/products/<int:pk>", views.VendorProductUpdateApi.as_view(), name="vendor_product_retrieve"),
    # path("vendors/products/<int:pk>/delete", views.VendorProductDeleteApi.as_view(), name="vendor_product_delete"),
]
