from django.urls import path

from . import views

app_name = "order"

urlpatterns = [
    path("orders/", views.OrderListView.as_view(), name="orders"),
    path("orders/<slug:id>/", views.Order.as_view(), name="order"),
    path("orderitems/", views.OrderItemListView.as_view(), name="orderitems"),
    path("orderitems/<slug:id>/", views.OrderItem.as_view(), name="orderitem"),
]
