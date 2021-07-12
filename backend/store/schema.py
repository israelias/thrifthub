import graphene
from graphene_django import DjangoObjectType

from .models import Category, Product, Image


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = ("id", "name", "category", "level", "slug")


class ProductImageType(DjangoObjectType):
    class Meta:
        model = Image
        field = ("id", "name", "image", "alt_text", "is_feature")

    def resolve_image(self, info):
        if self.image:
            self.image = info.context.build_absolute_uri(self.image.url)
        return self.image


class ProductType(DjangoObjectType):
    class Meta:
        model = Product
        fields = ("id", "title", "category", "vendor", "description", "regular_price", "slug", "product_image")


class Query(graphene.ObjectType):
    all_Categories = graphene.List(CategoryType)
    category_by_name = graphene.Field(CategoryType, name=graphene.String(required=True))
    all_Products = graphene.List(ProductType)
    all_Products_by_name = graphene.Field(ProductType, slug=graphene.String(required=True))

    def resolve_category_by_name(self, info, name):
        try:
            return Category.objects.get(name=name)
        except Category.DoesNotExist:
            return None

    def resolve_all_Products_by_name(self, info, slug):
        try:
            return Product.objects.get(slug=slug)
        except Product.DoesNotExist:
            return None

    def resolve_all_Categories(self, info):
        return Category.objects.filter(level=1)

    def resolve_all_Products(self, info):
        return Product.objects.all()
