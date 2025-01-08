# Thrifthub Backend Django E-Commerce API
![](documentation/screenshots/thrifthub-backend_api.jpg?raw=true)

This is a Django E-Commerce API. It is a RESTful API that allows users to add and like products, and make purchases with other vendors. The API is built using Django and Django REST framework, and it includes features such as user authentication, product management, order processing, and more. 


## Quick Start
1. Create a virtual environment:
    ```bash
   python -m venv venv
    ```
2. Activate the virtual environment:
   * On MacOS/Linux:
    ```bash
    source venv/bin/activate
     ```
    * On Windows:
    ```bash
    venv\Scripts\activate
    ```
3. Install the requirements:
    ```bash
    pip install -r requirements.txt
    ```
4. Run the migrations:
    ```bash
    python manage.py migrate
    ```
5. Create a superuser:
    ```bash
    python manage.py createsuperuser
    ```
6. Run the server:
    ```bash
    python manage.py runserver
    ```
7. Access the application:
    * Admin Panel: `http://127.0.0.1:8000/admin/`
    * API root: `http://127.0.0.1:8000/api/`
      * StoreApp: `http://127.0.0.1:8000/api/store/`
      * VendorApp: `http://127.0.0.1:8000/api/vendor/`
      * OrdersApp: `http://127.0.0.1:8000/api/orders/`
    * Expand related fields: `http://127.0.0.1:8000/api/store/?expand=category,images`
8. Access the documentation:
   * Swagger: `http://127.0.0.1:8000/swagger/`
   * Redoc: `http://127.0.0.1:8000/redoc/`
   * DRF: `http://127.0.0.1:8000/docs/`
9. Access the GraphQL Playground:
    * GraphQL: `http://127.0.0.1:8000/graphql/`

## Basic Features of The App

### VendorApp
The `VendorApp` handles vendor-related functionalities, including vendor account management and friend relationships between vendors.

- **Vendor Account**
  - Allows users to register and manage vendor accounts.
- **Friend**
  - Enables vendors to add and manage friends.

### StoreApp
The `StoreApp` manages the product catalog, including product details, categories, and images.

- **Product**
  - Allows vendors to add, edit, and delete products.
- **Category**
  - Enables categorization of products for better organization.
- **Image**
  - Supports uploading and managing product images.

### OrdersApp
The `OrdersApp` handles customer orders, including order creation, status updates, and order details.

- **Order**
  - Manages customer orders, including order creation and status updates.
- **OrderItem**
  - Handles individual items within an order, including quantity and product details.

## Models and Database Schema

### VendorApp
* **Vendor Model**  
  * **name**: `CharField` - The name of the vendor.  
  * **created_at**: `DateTimeField` - The date and time when the vendor was created.  
  * **updated_at**: `DateTimeField` - The date and time when the vendor was last updated.  
  * **created_by**: `OneToOneField` - The user who created the vendor.  
  * **slug**: `SlugField` - A URL-safe slug for the vendor.  
  * **online**: `BooleanField` - Indicates if the vendor is online.  
  * **image**: `VersatileImageField` - The profile image of the vendor.  

* **Friend Model**  
  * **vendors**: `ManyToManyField` - The vendors who are friends.  
  * **current_vendor**: `ForeignKey` - The current vendor who owns the friend list.  

### StoreApp
* **Category Model**  
  * **name**: `CharField` - The name of the category.  
  * **slug**: `SlugField` - A URL-safe slug for the category.  
  * **parent**: `TreeForeignKey` - The parent category.  
  * **ordering**: `IntegerField` - The order of the category.  
  * **is_active**: `BooleanField` - Indicates if the category is active.  

* **Product Model**  
  * **category**: `ForeignKey` - The category of the product.  
  * **vendor**: `ForeignKey` - The vendor who owns the product.  
  * **title**: `CharField` - The title of the product.  
  * **description**: `TextField` - The description of the product.  
  * **slug**: `SlugField` - A URL-safe slug for the product.  
  * **price**: `DecimalField` - The price of the product.  
  * **is_available**: `BooleanField` - Indicates if the product is available.  
  * **condition**: `PositiveIntegerField` - The condition of the product.  
  * **created_at**: `DateTimeField` - The date and time when the product was created.  
  * **updated_at**: `DateTimeField` - The date and time when the product was last updated.  

* **Image Model**  
  * **product**: `ForeignKey` - The product to which the image belongs.  
  * **name**: `CharField` - The name of the image.  
  * **image**: `VersatileImageField` - The image file.  
  * **image_ppoi**: `PPOIField` - The primary point of interest in the image.  
  * **alt_text**: `CharField` - The alternative text for the image.  
  * **is_feature**: `BooleanField` - Indicates if the image is the feature image.  
  * **created_at**: `DateTimeField` - The date and time when the image was created.  
  * **updated_at**: `DateTimeField` - The date and time when the image was last updated.  

* **Favorite Model**  
  * **vendor**: `OneToOneField` - The vendor who owns the favorites.  
  * **favorites**: `ManyToManyField` - The products that are favorited.  
  * **created_at**: `DateTimeField` - The date and time when the favorite was created.  

### OrdersApp
* **Order Model**  
  * **product**: `ForeignKey` - The product that is ordered.  
  * **vendor**: `ForeignKey` - The vendor who owns the order.  
  * **buyer**: `ForeignKey` - The vendor who made the order.  
  * **status**: `CharField` - The status of the order.  
  * **amount**: `DecimalField` - The amount offered for the order.  
  * **created_at**: `DateTimeField` - The date and time when the order was created.  
  * **updated_at**: `DateTimeField` - The date and time when the order was last updated.  

* **OrderDetail Model**  
  * **full_name**: `CharField` - The full name of the customer.  
  * **email**: `EmailField` - The email address of the customer.  
  * **phone_number**: `CharField` - The phone number of the customer.  
  * **country**: `CountryField` - The country of the customer.  
  * **zipcode**: `CharField` - The zip code of the customer.  
  * **town_or_city**: `CharField` - The town or city of the customer.  
  * **street_address1**: `CharField` - The first line of the street address.  
  * **street_address2**: `CharField` - The second line of the street address.  
  * **county**: `CharField` - The county of the customer.  
  * **created_at**: `DateTimeField` - The date and time when the order detail was created.  
  * **updated_at**: `DateTimeField` - The date and time when the order detail was last updated.  
  * **stripe_pid**: `CharField` - The Stripe payment ID.  
  * **order**: `ForeignKey` - The order to which the detail belongs. 

## API Endpoints

![](documentation/screenshots/thrifthub-backend_redoc.jpg?raw=true)

### VendorApp

* **Vendor Account**  
  * **GET** `/vendor/`: Retrieve a list of all vendors.  
  * **GET** `/vendor/<id>/`: Retrieve details of a specific vendor.  
  * **POST** `/vendor/`: Create a new vendor account.  
  * **PUT** `/vendor/<id>/`: Update a specific vendor account.  
  * **DELETE** `/vendor/<id>/`: Delete a specific vendor account.  

* **Friend**  
  * **GET** `/vendor/<id>/friends/`: Retrieve a list of friends for a specific vendor.  
  * **POST** `/vendor/<id>/friends/`: Add a new friend for a specific vendor.  
  * **DELETE** `/vendor/<id>/friends/<friend_id>/`: Remove a friend from a specific vendor.  

### StoreApp

* **Product**  
  * **GET** `/store/`: Retrieve a list of all products.  
  * **GET** `/store/<id>/`: Retrieve details of a specific product.  
  * **POST** `/store/`: Add a new product.  
  * **PUT** `/store/<id>/`: Update a specific product.  
  * **DELETE** `/store/<id>/`: Delete a specific product.  

* **Category**  
  * **GET** `/store/category/`: Retrieve a list of all categories.  
  * **GET** `/store/category/<slug>/`: Retrieve products by category.  
  * **POST** `/store/category/`: Add a new category.  
  * **PUT** `/store/category/<slug>/`: Update a specific category.  
  * **DELETE** `/store/category/<slug>/`: Delete a specific category.  

* **Image**  
  * **GET** `/store/images/`: Retrieve a list of all product images.  
  * **GET** `/store/images/<id>/`: Retrieve images for a specific product.  
  * **POST** `/store/images/`: Upload a new product image.  
  * **DELETE** `/store/images/<id>/`: Delete a specific product image.  

### OrdersApp

* **Order**  
  * **GET** `/orders/`: Retrieve a list of all orders.  
  * **GET** `/orders/<id>/`: Retrieve details of a specific order.  
  * **POST** `/orders/`: Create a new order.  
  * **PUT** `/orders/<id>/`: Update a specific order.  
  * **DELETE** `/orders/<id>/`: Delete a specific order.  

* **OrderItem**  
  * **GET** `/orderdetail/`: Retrieve a list of all order items.  
  * **GET** `/orderdetail/<id>/`: Retrieve details of a specific order item.  
  * **POST** `/orderdetail/`: Add a new order item.  
  * **PUT** `/orderdetail/<id>/`: Update a specific order item.  
  * **DELETE** `/orderdetail/<id>/`: Delete a specific order item.  

## OpenAPI (Swagger) Documentation
![](documentation/screenshots/thrifthub-backend_swagger-spec.jpg?raw=true)
The Django application uses the `drf_yasg` package to generate OpenAPI (Swagger) documentation for the API. This setup helps in generating and customizing the API documentation.

### Key Components
* **CustomOpenAPISchemaGenerator**:
   * Customizes the schema generation process by setting a base path (/api/v1.0) for all API endpoints, useful for versioning the API.
* **CompoundTagsSchema**:
  * Customizes the tags used in the Swagger documentation by combining operation keys to create compound tags, which helps organize the API documentation more effectively.
* **api_info**:
  * Contains metadata about the API, such as the title, version, description, terms of service, contact email, and license information. This information is displayed in the generated Swagger documentation.
* **schema_view**:
  * Sets up the schema view using the `get_schema_view` function from `drf_yasg`. It uses the custom schema generator (`CustomOpenAPISchemaGenerator`), the API metadata (`api_info`), and allows public access to the documentation (`permissions.AllowAny`).

## GraphQL and Graphene
![](documentation/screenshots/thrifthub-backend_graphql.jpg?raw=true)

The Django application uses GraphQL with the graphene-django package to create a flexible and efficient API. This setup allows clients to perform complex queries and mutations on the Django models using GraphQL.  

### Key Components
* **Schema Definition**:  
  * Defines the structure of the API, including the types of data that can be queried and the available operations (queries and mutations).
* **Types**:  
  * Represents the data models in the API. DjangoObjectType is used to create GraphQL types from Django models.
* **Queries**:  
  * Defines the read operations that clients can perform, specifying the data that can be fetched and the arguments that can be used to filter the data.
* **Mutations**:
  * Defines the write operations that clients can perform, allowing clients to create, update, or delete data.

### Example Components
* `*`**Type**:
  * Defines a GraphQL type for the `*` model.
* **Query**:
  * Defines the available queries for the `*` model.
* **Mutation**:
  * Defines the available mutations for `*` using `graphql_jwt`.
* **Schema**:
  * Combines the queries and mutations into a single schema.

This setup provides a flexible and efficient API for interacting with the Django models using GraphQL.

### GraphQL Playground
The GraphQL endpoint is available at `/graphql/` and allows clients to perform queries and mutations on the Django models using GraphQL.

## Stripe
Stripe makes it easy to be PCI compliant. With a proper integration, you will never have access to your customers' payment information.

A typical payment flow with Stripe can be divided in two steps:

Collect the customer's payment information, using the prebuilt [Checkout form](https://stripe.com/docs/payments/checkout), or a form of your own using [Stripe.js](https://stripe.com/docs/js).

In both cases, the card information is sent directly from the customer's browser to Stripe's servers, which return a [card token](https://stripe.com/docs/api/tokens/object). You then send this token to your backend.

On your backend, you use the token to [create a charge](https://stripe.com/docs/api/charges/create).

The token represents a card, but hides the PCI sensitive information (i.e. the whole card number and the CVC) from you.

You can find a simple tutorial for creating charges [here](https://stripe.com/docs/payments/charges-api).

If you don't plan on charging the same customer multiple times (or if you don't mind asking them to provide their card information every time), then you don't necessarily need to store anything in your own database. When you create the charge, you will be immediately informed of the result (success or failure) and can take the necessary actions.

## Steps to Configure AWS S3 Bucket
1. **Create an AWS Account**: If you don't have an AWS account, [sign up here](https://aws.amazon.com/).

2. **Create an S3 Bucket**:
   - Navigate to the [S3 Management Console](https://s3.console.aws.amazon.com/s3/).
   - Click "Create bucket" and follow the prompts to set up your bucket.

3. **Set Bucket Permissions**:
   - **Bucket Policy**: Ensure your bucket policy allows the necessary access. Here's an example policy that grants public read access to all objects in the bucket:
     ```json
     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Effect": "Allow",
                 "Principal": "*",
                 "Action": "s3:GetObject",
                 "Resource": "arn:aws:s3:::your-bucket-name/*"
             }
         ]
     }
     ```
     Replace `your-bucket-name` with the name of your S3 bucket.

4. **Configure CORS (Cross-Origin Resource Sharing)**:
   - In the S3 console, select your bucket.
   - Go to the "Permissions" tab and scroll to "Cross-origin resource sharing (CORS)".
   - Click "Edit" and add the following JSON configuration:
     ```json
     [
         {
             "AllowedHeaders": ["*"],
             "AllowedMethods": ["GET", "POST", "PUT", "DELETE"],
             "AllowedOrigins": ["*"],
             "ExposeHeaders": []
         }
     ]
     ```
     This configuration allows all origins to access your bucket using the specified methods. Adjust the `AllowedOrigins` and `AllowedMethods` as per your application's requirements. For more details, refer to the [AWS S3 CORS documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/cors.html).

5. **Create an IAM User**:
   - Navigate to the [IAM Management Console](https://console.aws.amazon.com/iam/).
   - Create a new user with programmatic access.
   - Attach the `AmazonS3FullAccess` policy to the user. For more granular control, consider creating a custom policy:
     ```json
     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Effect": "Allow",
                 "Action": "s3:*",
                 "Resource": [
                     "arn:aws:s3:::your-bucket-name",
                     "arn:aws:s3:::your-bucket-name/*"
                 ]
             }
         ]
     }
     ```
     Replace `your-bucket-name` with your actual bucket name. This policy grants full access to the specified bucket and its contents.

6. **Obtain Access Credentials**:
   - After creating the IAM user, note the **Access Key ID** and **Secret Access Key**. Store these securely, as they are required for configuring your Django application.

7. **Required Packages**:
   - Use pip to install the necessary packages if you haven't already:
     ```bash
     pip install boto3 django-storages
     ```
     - `boto3` is the Amazon Web Services (AWS) SDK for Python, which allows Python developers to write software that makes use of Amazon services.
     - `django-storages` is a collection of custom storage backends for Django, including S3 storage.

8. **Follow Configuration of Django Settings**:
   - In `core/settings.py`, add `'storages'` to your `INSTALLED_APPS`:
     ```python
     INSTALLED_APPS = [
         # other apps
         'storages',
     ]
     ```
   - Check the following settings if `USE_S3` is set to `True`:
     ```python
     AWS_ACCESS_KEY_ID = 'your-access-key-id'
     AWS_SECRET_ACCESS_KEY = 'your-secret-access-key'
     AWS_STORAGE_BUCKET_NAME = 'your-bucket-name'
     AWS_S3_REGION_NAME = 'your-region'  # e.g., 'us-east-1'
     AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com'

     # Static files
     STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/static/'
     STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

     # Media files
     MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/media/'
     DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
     ```
     Replace the placeholder values with your actual AWS credentials and bucket details. This configuration tells Django to use S3 for storing static and media files.

## References
- [Hello GraphQL](https://docs.graphene-python.org/projects/django/en/latest/tutorial-plain/)
- [Django + Graphene](https://www.fullstack.com/labs/resources/blog/django-graphene-from-rest-to-graphql)
- [Test Cases](https://rajansahu713.medium.com/mastering-the-art-of-django-test-cases-fa7b0322c9fb)
- [Using PathLib](https://adamj.eu/tech/2020/03/16/use-pathlib-in-your-django-project/)
- [Categories with django-mptt](https://djangopy.org/package-of-week/categories-with-django-mptt/)
- [Django-Rest Flex-Fields](https://github.com/rsinger86/drf-flex-fields#query-optimization-experimental)
- [DRF-YASG: Yet Another Swagger Generator](https://github.com/axnsan12/drf-yasg/)
- [DRF: ReDoc](https://github.com/Redocly/redoc)
- [Documenting your API using Open API (Swagger) and Redoc in Django Rest Framework.](https://medium.com/@torkashvand/)
- [Django REST Framework combining routers from different apps](https://stackoverflow.com/questions/31483282/django-rest-framework-combining-routers-from-different-apps)
- [Sebastien Mirolo: Documenting an API implemented with Django Rest Framework](https://www.djaodjin.com/blog/django-rest-framework-api-docs.blog)
- [DRF: Filtering](https://www.django-rest-framework.org/api-guide/filtering/#filtering-against-the-current-user)
- [DRF: SerializerMethodField](https://www.django-rest-framework.org/api-guide/fields/#serializermethodfield)
- [DRF: Database Functions](https://docs.djangoproject.com/en/3.2/ref/models/database-functions/)
- [DRF: Create Profile with User via Signals](https://stackoverflow.com/questions/33659994/django-rest-framework-create-user-and-user-profile)
- [DRF: Signals](https://docs.djangoproject.com/en/3.2/topics/signals/)
- [Django-Storages with AWS S3](https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html)
- [Django: Email Host](https://docs.djangoproject.com/en/3.2/ref/settings/#std:setting-EMAIL_HOST)
- [Resizing Images on upload](https://www.reddit.com/r/django/comments/99za8t/resizing_images_on_upload_is_there_any_reason_i/)
- [Django-VersatileImageField](https://django-versatileimagefield.readthedocs.io/en/latest)
- [Django-VersatileImageField: Improving Performance](https://django-versatileimagefield.readthedocs.io/en/latest/improving_performance.html)
- [Django: ROOT_URLCONF, MEDIAL_ROOT and STATIC_URL](https://docs.djangoproject.com/en/3.2/ref/settings/#std:setting-ROOT_URLCONF)
- [Django: DEFAULT_FILE_STORAGE and STATICFILES_DIRS](https://docs.djangoproject.com/en/3.2/ref/settings/#std:setting-DEFAULT_FILE_STORAGE)
- [Adam Johnson: Use Pathlib in Your Django Settings File (Django ^3.1)](https://adamj.eu/tech/2020/03/16/use-pathlib-in-your-django-project/)
- [Create Custom Exception Handler](https://djangocircle.com/create-custom-exception-handler-django-rest-api/)
- [Creating a Django API using Django Rest Framework APIView](https://medium.com/the-andela-way/creating-a-django-api-using-django-rest-framework-apiview-b365dca53c1d)
- [Django Internationalization/Localization](https://docs.djangoproject.com/en/3.2/topics/i18n/)
- [CORS guide](https://www.stackhawk.com/blog/django-cors-guide/)
- [Python `del` syntax](https://www.geeksforgeeks.org/python-del-to-delete-objects/)