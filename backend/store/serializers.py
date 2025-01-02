import random

import order.models as order_models
import vendor.models as vendor_models
from django.db.models import Q
from rest_flex_fields import FlexFieldsModelSerializer
from rest_framework import serializers
from versatileimagefield.serializers import VersatileImageFieldSerializer
from .models import Category, Favorite, Image, Product


class CategorySerializer(serializers.ModelSerializer):
    products = serializers.StringRelatedField(many=True)

    class Meta:
        model = Category
        fields = ["id", "name", "products", "slug"]


class VendorFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = vendor_models.Vendor
        fields = "__all__"


class RawProductSlugSerializer(serializers.BaseSerializer):
    def to_representation(self, obj) -> str:
        """
        The to_representation function is called when the serializer is being converted to JSON.
        It takes an object as its first argument, and returns a representation of that object.
        In this case, we are returning the slug field of our model.

        Args:
            self: Access the other methods and properties of the class
            obj: Pass the current object being serialized

        Returns:
            The slug of the object
        """
        return obj.slug


class RawIdSerializer(serializers.BaseSerializer):
    def to_representation(self, obj) -> str:
        """
        The to_representation function is called to return a Python object that will be serialized.
        In this case, it returns the id of the object.

        Args:
            self: Access the attributes and methods of the parent class
            obj: Pass the object being serialized

        Returns:
            The id of the object
        """
        return obj.id


class VendorPreviewSerializer(serializers.ModelSerializer):
    order_count = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    favorites = serializers.SerializerMethodField()
    order_requests = serializers.SerializerMethodField()
    orders_made = serializers.SerializerMethodField()

    class Meta:
        model = vendor_models.Vendor
        fields = [
            "id",
            "name",
            "online",
            "image",
            "product_count",
            "order_count",
            "favorites",
            "order_requests",
            "orders_made",
        ]

    def get_order_count(self, obj) -> int:
        """
        The get_order_count function is a helper function that returns the number of orders associated with a vendor or buyer.
        It takes in an object, which is either a Vendor or Buyer instance, and then uses the Q class to filter for all orders where
        the vendor field matches the given object (or vice versa) and then distinct()s it so that we don't count duplicate orders.
        Finally, it counts how many there are.

        Args:
            self: Access the class that is calling it
            obj: Get the vendor or buyer of the object

        Returns:
            The number of orders that the vendor or buyer has
        """
        return (
            order_models.Order.objects.filter(Q(vendor=obj) | Q(buyer=obj))
            .distinct()
            .count()
        )

    def get_product_count(self, obj) -> int:
        """
        The get_product_count function returns the number of products associated with a vendor.
        It is used in the VendorSerializer to display this information.

        Args:
            self: Access the attributes and methods of the class
            obj: Get the vendor object

        Returns:
            The number of products associated with a vendor
        """
        return Product.objects.filter(vendor=obj).count()

    def get_favorites(self, obj) -> int:
        """
        The get_favorites function is a helper function that returns the list of products
        that have been favorited by the vendor. It takes in an object (vendor) and then
        returns a serialized version of all the products that have been favorited by this vendor.

        Args:
            self: Access the class object within a method
            obj: Get the vendor object that is being serialized

        Returns:
            A list of the favorite products for a vendor
        """
        favorites, created = Favorite.objects.get_or_create(vendor=obj)
        favorite_products = obj.favorites.favorites.all()
        product_serializer = RawProductSlugSerializer(favorite_products, many=True)
        return product_serializer.data

    def get_order_requests(self, obj) -> int:
        """
        The get_order_requests function returns a list of all the orders that have been made to this vendor.
        The order_models.Order model is queried for all objects where the vendor field matches obj, which is passed in as an argument.

        Args:
            self: Access the class that is calling the function
            obj: Get the vendor object from the model

        Returns:
            A list of order objects that are associated with the vendor
        """
        order_requests = order_models.Order.objects.filter(vendor=obj)
        order_serializer = RawIdSerializer(order_requests, many=True)
        return order_serializer.data

    def get_orders_made(self, obj) -> int:
        """
        The get_orders_made function returns a list of all the orders made by the user.
        The function takes in an object as an argument, which is then used to get all
        the orders made by that particular user.

        Args:
            self: Access the class that is calling it
            obj: Get the user object that is currently being serialized

        Returns:
            A list of order objects for the buyer

        """
        orders_made = order_models.Order.objects.filter(buyer=obj)
        order_serializer = RawIdSerializer(orders_made, many=True)
        return order_serializer.data

    def get_product_count(self, obj) -> int:
        """
        The get_product_count function returns the number of products associated with a vendor.
        It is used in the VendorSerializer to display this information.

        Args:
            self: Access the attributes and methods of the class
            obj: Get the vendor object from the vendor model

        Returns:
            The number of products associated with a vendor
        """
        return Product.objects.filter(vendor=obj).count()


class CategoryPreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class CategoryFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class VendorSlugSerializer(serializers.ModelSerializer):
    class Meta:
        model = vendor_models.Vendor
        fields = ["id", "name", "slug"]


class ImagePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ("product", "image")


class ImageFullSerializer(FlexFieldsModelSerializer):
    image = VersatileImageFieldSerializer(
        sizes=[
            ("full_size", "url"),
            ("thumbnail", "thumbnail__240x180"),
        ]
    )

    class Meta:
        model = Image
        fields = [
            "image",
            "alt_text",
            "is_feature",
            "product",
            "created_at",
            "name",
            "id",
        ]
        extra_kwargs = {
            "image": {"required": True},
        }

    def create(self, validated_data) -> Image:
        """
        The create function creates a new image instance and saves it to the database.
        It also sets the is_feature field to false by default, and if an image is marked as a feature,
        it will be set to true.

        Args:
            self: Refer to the object of the class
            validated_data: Pass in the dictionary of data that was sent to the api

        Returns:
            An instance of the image model
        """
        instance = Image.objects.create(
            product=validated_data.get("product"),
            is_feature=validated_data.get("is_feature", False),
            image=validated_data.get("image"),
        )

        instance.save()

        return instance


class ImageNewSerializer(FlexFieldsModelSerializer):
    image = VersatileImageFieldSerializer(
        sizes=[
            ("full_size", "url"),
            ("thumbnail", "thumbnail__240x180"),
        ]
    )

    class Meta:
        model = Image
        fields = ["image", "alt_text", "is_feature", "id"]


class RawOrderStatusSerializer(serializers.BaseSerializer):
    def to_representation(self, obj) -> str:
        return obj.status


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    vendor = VendorSlugSerializer(read_only=True)
    condition = serializers.CharField(source="get_condition_display", read_only=True)
    product_images = ImageNewSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "vendor",
            "title",
            "description",
            "image",
            "slug",
            "price",
            "is_available",
            "condition",
            "created_at",
            "updated_at",
            "product_images",
        ]

    def get_image(self, obj) -> str:
        """
        The get_image function is a helper function that returns the image of the product.
        It first checks if there are any images associated with the product, and then returns
        the first one it finds.

        Args:
            self: Access the class object within a method
            obj: Get the product object from the product model

        Returns:
            The image of the product
        """
        images = Image.objects.filter(product=obj).first()
        if not images:
            return {}
        image_serializer = ImageNewSerializer(images)
        return image_serializer.data.get("image")


class OrderedProductDetailSerializer(FlexFieldsModelSerializer):
    class Meta:
        model = order_models.OrderDetail
        fields = "__all__"


class OrderedProductSerializer(FlexFieldsModelSerializer):
    buyer = VendorPreviewSerializer(read_only=True)
    product = ProductSerializer(read_only=True)

    # product = serializers.StringRelatedField()

    class Meta:
        model = order_models.Order
        fields = [
            "id",
            "buyer",
            "status",
            "product",
            "amount",
            "created_at",
            "updated_at",
            "order_detail",
        ]
        expandable_fields = {
            # "buyer": VendorPreviewSerializer,
            # "product": ProductSerializer,
            "orderdetail": OrderedProductDetailSerializer,
        }


class ProductPreviewSerializer(FlexFieldsModelSerializer):
    """
    This class is a serializer for the ProductPreview model.
    It inherits from the FlexFieldsModelSerializer class, which is a subclass of the ModelSerializer class

    """

    # VIEW FOR ORDER ITEMS
    category = serializers.StringRelatedField(read_only=True)
    vendor = serializers.StringRelatedField(read_only=True)
    image = serializers.SerializerMethodField(read_only=True)
    condition = serializers.CharField(source="get_condition_display", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "category",
            "vendor",
            "title",
            "slug",
            "price",
            "condition",
            "is_available",
            "image",
            "created_at",
            "updated_at",
        ]
        expandable_fields = {
            "category": CategoryFullSerializer,
            "image": ImageNewSerializer,
            "vendor": VendorPreviewSerializer,
        }

    def get_image(self, obj) -> str:
        """
        The get_image function is a helper function that returns the image of the product.
        It takes in an object and then checks if there are any images associated with it.
        If so, it will return the first image as a string.

        Args:
            self: Access the class that called it
            obj: Get the product object

        Returns:
            The image of the product
        """
        images = Image.objects.filter(product=obj).first()
        if images:
            image_serializer = ImageNewSerializer(images)
            return image_serializer.data.get("image")
        return {}


class ProductSimilarSerializer(FlexFieldsModelSerializer):
    """
    This class is a serializer for the ProductSimilar model.
    It inherits from the FlexFieldsModelSerializer class, which is
    a subclass of the ModelSerializer class
    """

    condition = serializers.CharField(source="get_condition_display", read_only=True)
    image = serializers.SerializerMethodField(read_only=True)
    category = CategoryPreviewSerializer()
    vendor = VendorPreviewSerializer()

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "vendor",
            "category",
            "description",
            "slug",
            "price",
            "is_available",
            "condition",
            "image",
            "created_at",
            "updated_at",
        ]
        expandable_fields = {
            "category": CategoryPreviewSerializer,
            "vendor": VendorPreviewSerializer,
        }

    def get_image(self, obj) -> str:
        """
        The get_image function is a helper function that returns the image of the product.
        It first checks if there are any images associated with the product and then returns
        the first one it finds.

        Args:
            self: Access the class that is calling it
            obj: Get the product object from the product model

        Returns:
            The image for the product
        """
        images = Image.objects.filter(product=obj).first()
        if images:
            image_serializer = ImageNewSerializer(images)
            return image_serializer.data.get("image")
        return {}


class ProductVersatileSerializer(FlexFieldsModelSerializer):
    """
    This class is a serializer for the Product model.
    It has a few fields, and it can be used to serialize a Product model
    instance
    """

    similar_products = serializers.SerializerMethodField()
    absolute_url = serializers.CharField(source="get_absolute_url", read_only=True)
    image = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "vendor",
            "category",
            "description",
            "slug",
            "price",
            "condition",
            "is_available",
            "image",
            "product_images",
            "similar_products",
            "absolute_url",
            "created_at",
            "updated_at",
            "ordered_product",
        ]
        expandable_fields = {
            "category": CategoryFullSerializer,
            "vendor": VendorPreviewSerializer,
            "product_images": (ImageNewSerializer, {"many": True}),
            "ordered_product": (OrderedProductSerializer, {"many": True}),
        }
        extra_kwargs = {
            "product_images": {"required": False},
            "is_available": {"required": False},
            "ordered_product": {"required": False},
        }

    def get_similar_products(self, obj) -> list:
        """
        The get_similar_products function is a helper function that returns the similar products of a product.
        It takes in an object and returns the serialized data of all the products that are not equal to
        the object itself, but have at least one category in common with it. It also only returns 4 items.

        Args:
            self: Access the class object within a method
            obj: Get the product object that we want to find similar products for

        Returns:
            A list of similar products for a given product
        """

        similar_products = list(obj.category.products.exclude(id=obj.id))

        if len(similar_products) >= 4:
            similar_products = random.sample(similar_products, 4)

        product_serializer = ProductSimilarSerializer(similar_products, many=True)
        return product_serializer.data

    def get_image(self, obj) -> str:
        """
        The get_image function is a helper function that returns the image of the product.
        It takes in an object and then checks if there are any images associated with it.
        If there are, it will return the first image as a string.

        Args:
            self: Access the class that called it
            obj: Get the product object from the productserializer

        Returns:
            The image of the product
        """

        images = Image.objects.filter(product=obj).first()
        if images:
            image_serializer = ImageNewSerializer(images)
            return image_serializer.data.get("image")
        return {}

    def create(self, validated_data) -> Product:
        """
        The create function creates a new product instance and saves it to the database.
        It also takes in an argument called validated_data which is a dictionary of all the data that has been validated by our serializer.
        The create function then loops through each image in images and creates an Image model instance for each one, setting its product field to be equal to the newly created product instance.

        Args:
            self: Reference the class instance itself
            validated_data: Pass in the validated data that was created by the serializer

        Returns:
            The instance of the product that was created
        """
        vendor = self.context["request"].user.vendor

        print("images field", self.context["request"].data["images"])

        product_image_data = dict((self.context["request"].data).lists())["images"]

        print("images as dict", product_image_data)

        instance = Product.objects.create(
            vendor=vendor,
            title=validated_data["title"],
            description=validated_data["description"],
            price=validated_data["price"],
            condition=validated_data["condition"],
            category=validated_data["category"],
        )

        instance.save()

        if product_image_data:
            for img_name in product_image_data:
                print("each item in images", img_name)
                modified_data = Image.objects.create(product=instance, image=img_name)
                file_serializer = ImagePostSerializer(data=modified_data)
                if file_serializer.is_valid():
                    file_serializer.save()

        return instance

    def update(self, instance, validated_data) -> Product:
        """
        The update function is used to update the product.
        It takes in a request and validated data, then updates the fields of the product.
        If there are images attached to it, they will be kept if they are still attached to this product.
        Any other images that were previously attached but not sent with this request will be deleted.

        Args:
            self: Reference the current class instance
            instance: Get the current product
            validated_data: Pass in the data to be updated

        Returns:
            The updated product
        """
        request = self.context["request"]
        vendor = request.user.vendor

        # Check if there is an images field
        images_request = request.data.get("images", None)
        print("new", images_request)

        # Find current images attached to the product
        current_images = Image.objects.filter(product=instance)
        print("existing", current_images)

        # If there is data, they would be new
        to_remove = []
        if images_request:
            for img in dict((request.data).lists())["images"]:
                new_image = Image.objects.create(product=instance, image=img)
                image_serializer = ImagePostSerializer(data=new_image)
                if image_serializer.is_valid():
                    print("herreee?")
                    image_serializer.save()
                to_remove.append(new_image.id)
                print("appended", new_image)

        # Update any fields to the validated args, else keep the previous value
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.price = validated_data.get("price", instance.price)
        instance.condition = validated_data.get("condition", instance.condition)
        instance.category = validated_data.get("category", instance.category)

        # Finally save the updates to the produuct
        instance.save()
        print("saved additions", instance.product_images.all())

        # To know if other images were removed,
        # deleted_images = Image.objects.filter(id=instance.id)

        # And then deal with destroying the images no longer attached to the product
        print("LIST", to_remove)
        if len(to_remove) > 0:
            for img in list(instance.product_images.exclude(id__in=to_remove)):
                print("here?", list(instance.product_images.exclude(id__in=to_remove)))
                old_image = Image.objects.get(id=img.id)
                print("herrrr", old_image)
                old_image.delete()

        return instance
