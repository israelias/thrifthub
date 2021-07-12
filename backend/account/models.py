from django.contrib.auth.models import User
from django.db import models
from django.db.models.functions import Lower
from vendor.models import Vendor
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserManager(models.Manager):
    def create(self, username, password):
        user = User(username=username, password=password)
        user.save()
        vendor = Vendor(name=Lower(username), created_by=user, slug=Lower(username))
        vendor.save()
        return user


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Vendor.objects.create(user=instance)
