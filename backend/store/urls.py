from django.urls import path

from . import views

app_name = "store"

urlpatterns = [
    path("api/", views.ProductListView.as_view(), name="store_home"),
    path("api/category/", views.CategoryListView.as_view(), name="categories"),
    # path("api/<slug:slug>/", views.product.as_view(), name="product"),
    path("api/products/search/", views.ProductApi.as_view(), name="product_search"),
    path(
        "api/products/",
        views.ProductCartViewSet.as_view({"get": "list"}),
        name="product_all",
    ),
    path(
        "api/products/<slug:category_slug>/<slug:product_slug>",
        views.ProductCartViewSet.as_view({"get": "retrieve"}),
        name="product_retrieve",
    ),
    path(
        "api/add/<slug:category_slug>/<slug:product_slug>",
        views.ProductCartViewSet.as_view({"post": "create"}),
        name="product_add",
    ),
    path("api/category/<slug:slug>/", views.CategoryItemView.as_view(), name="category_item"),
]
