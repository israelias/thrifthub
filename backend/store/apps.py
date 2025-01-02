from django.apps import AppConfig


class StoreConfig(AppConfig):
    """
    The StoreConfig class inherits from the AppConfig class,
    which is a class that is defined in the django.apps module.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "store"
