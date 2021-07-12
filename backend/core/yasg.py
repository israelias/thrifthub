from drf_yasg import openapi
from drf_yasg.generators import OpenAPISchemaGenerator
from drf_yasg.inspectors import SwaggerAutoSchema
from drf_yasg.views import get_schema_view
from rest_framework import permissions


# https://github.com/axnsan12/drf-yasg/issues/146
class CustomOpenAPISchemaGenerator(OpenAPISchemaGenerator):
    def get_schema(self, *args, **kwargs):
        schema = super().get_schema(*args, **kwargs)
        schema.basePath = "/api/v1.0"  # API prefix
        return schema


class CompoundTagsSchema(SwaggerAutoSchema):

    # See https://github.com/axnsan12/drf-yasg/issues/56
    def get_tags(self, operation_keys):
        return [" > ".join(operation_keys[:-1])]


schema_view = get_schema_view(
    openapi.Info(
        title="ThriftHub API",
        default_version="v1",
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="israelias.js@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    generator_class=CustomOpenAPISchemaGenerator,
   
)


