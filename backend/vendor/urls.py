from django.urls import path

from . import views

app_name = "vendor"

urlpatterns = [
    path("api/vendors/", views.VendorList.as_view(), name="vendors_profiles"),
    path("api/vendors/<int:pk>/", views.VendorDetail.as_view(), name="vendor_profile"),
    path("api/vendors/profile/", views.VendorProductListView.as_view(), name="vendors_profiles_test"),
    path("api/vendors/profile/<int:pk>/", views.VendorProductDetail.as_view(), name="vendor_profile_test"),
    path("api/vendors/products", views.VendorProductApi.as_view(), name="vendor_product_get"),
    path("api/vendors/products/create", views.VendorProductCreateApi.as_view(), name="vendor_product_create"),
    path("api/vendors/products/<int:pk>", views.VendorProductUpdateApi.as_view(), name="vendor_product_retrieve"),
    path("api/vendors/products/<int:pk>/delete", views.VendorProductDeleteApi.as_view(), name="vendor_product_delete"),
]
