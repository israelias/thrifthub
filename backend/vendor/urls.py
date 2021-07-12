from django.urls import path

from . import views

app_name = "vendor"

urlpatterns = [
    # includes favorites, and friends' products
    path("vendor/<int:pk>/", views.OtherVendorDetailView.as_view()),
    path("vendor/<int:pk>/favorites/", views.VendorFavoriteListView.as_view()),
    path("vendor/<int:pk>/friends/", views.VendorFriendsListView.as_view()),
    path("vendor/search/<str:query>/", views.VendorSearchListView.as_view()),
    # previous
    # path("vendors/", views.VendorList.as_view(), name="vendors_profiles"),
    # path("vendors/<int:pk>/", views.VendorDetail.as_view(), name="vendor_profile"),
    # path("vendors/profile/", views.VendorProductListView.as_view(), name="vendors_profiles_test"),
    # path("vendors/profile/<int:pk>/", views.VendorProductDetail.as_view(), name="vendor_profile_test"),
    # path("vendors/products", views.VendorProductApi.as_view(), name="vendor_product_get"),
    # path("vendors/products/create", views.VendorProductCreateApi.as_view(), name="vendor_product_create"),
    # path("vendors/products/<int:pk>", views.VendorProductUpdateApi.as_view(), name="vendor_product_retrieve"),
    # path("vendors/products/<int:pk>/delete", views.VendorProductDeleteApi.as_view(), name="vendor_product_delete"),
]
