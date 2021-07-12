from django.conf import settings
from django.contrib.auth.models import AbstractUser, User
from django.db import models
from django.db.models.functions import Lower
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _
from vendor.models import Vendor

# class User(AbstractUser):
#     username = models.CharField(blank=True, null=True)
#     email = models.EmailField(_("email address"), unique=True)

#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = ["username", "first_name", "last_name"]

#     def __str__(self):
#         return "{}".format(self.email)


# class UserProfile(models.Model):
#     user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
#     title = models.CharField(max_length=5)
#     dob = models.DateField()
#     address = models.CharField(max_length=255)
#     country = models.CharField(max_length=50)
#     city = models.CharField(max_length=50)
#     zip = models.CharField(max_length=5)
#     photo = models.ImageField(upload_to="uploads", blank=True)


class UserManager(models.Manager):
    def create(self, username, password):
        print("MANAGERMODEL")
        user = User(username=username, password=password)
        user.save()
        vendor = Vendor(name=Lower(username), created_by=user, slug=Lower(username))
        vendor.save()
        return vendor


@receiver(post_save, sender=User)
def create_or_update_vendor(sender, instance, created, **kwargs):
    print("RECEIVER")
    print("SENDER", sender.username)
    print("INSTANCE", instance)
    print("CREATED", created)
    if created:
        Vendor.objects.create(
            name=instance.get_username().lower(), created_by=instance, slug=instance.get_username().lower()
        )
    instance.vendor.save()
