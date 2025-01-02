from django.urls import include, path, re_path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "store"

router = DefaultRouter()
router.register(r"store", views.ProductViewSet, basename="product")
router.register(r"category", views.CategoryViewSet, basename="category")
router.register(r"images", views.ProductImagesViewSet, basename="images")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "store/category/<slug:slug>/",
        views.ProductsByCategory.as_view(),
        name="product-category-list",
    ),
    re_path(
        r"^store/category/(?P<hierarchy>.+)/$",
        views.ProductsByCategories.as_view(),
        name="product-category-item",
    ),
    path(
        "store/vendor/<slug>/",
        views.ProductsByVendorView.as_view(),
        name="product-vendor-filter",
    ),
    path("category/", views.CategoryListView.as_view(), name="category-filter"),
    path(
        "store/images/<id>/",
        views.ProductImagesByProductId.as_view(),
        name="product-images-filter",
    ),
]
