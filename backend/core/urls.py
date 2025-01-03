"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from graphql_jwt.decorators import jwt_cookie
from rest_framework.documentation import include_docs_urls

from .yasg import schema_view

# ---------- Django REST ----------#

urlpatterns_root = [
    path("", include("account.urls", namespace="account")),
    path("", include("store.urls", namespace="store")),
    path("", include("vendor.urls", namespace="vendor")),
    path("", include("order.urls", namespace="order")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("graphql/", jwt_cookie(csrf_exempt(GraphQLView.as_view(graphiql=True)))),
    url(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    url(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    url(
        r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
    path("docs/", include_docs_urls(title="ThriftHub API")),
    path("", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    url(r"^api/", include(urlpatterns_root)),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
