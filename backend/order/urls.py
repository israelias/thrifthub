from django.urls import path

from . import views

app_name = "order"

urlpatterns = [
    path("api/orders/", views.OrderListView.as_view(), name="orders"),
    path("api/orders/<slug:id>/", views.Order.as_view(), name="order"),
    path("api/orderitems/", views.OrderItemListView.as_view(), name="orderitems"),
    path("api/orderitems/<slug:id>/", views.OrderItem.as_view(), name="orderitem"),
]
