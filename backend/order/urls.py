from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "order"

router = DefaultRouter()
router.register(r"orders", views.VendorOrderViewSet, basename="vendor_order")
router.register(r"orderdetail", views.VendorOrderDetailViewSet, basename="vendor_order_detail")

urlpatterns = [
    path("", include(router.urls)),
    # path("orderitems/", views.OrderItemListView.as_view(), name="orderitems"),
    # path("orderitems/<slug:id>/", views.OrderItem.as_view(), name="orderitem"),
]
