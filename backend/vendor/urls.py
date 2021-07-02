from django.urls import path

from . import views

app_name = "vendor"

urlpatterns = [
    path("api/vendors", views.VendorListView.as_view(), name="all_vendors"),
    path("api/vendors/<slug:slug>/", views.Vendor.as_view(), name="vendor"),
]
