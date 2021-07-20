from django.conf import settings
from django.contrib.auth.models import AbstractUser, User, BaseUserManager
from django.db import models
from django.db.models.functions import Lower
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import ugettext_lazy as _
from vendor.models import Vendor


@receiver(post_save, sender=User)
def create_or_update_vendor(sender, instance, created, **kwargs):
    print("RECEIVER")
    print("SENDER", sender.username)
    print("INSTANCE", instance)
    print("CREATED", created)
    if created:
        Vendor.objects.create(
            name=instance.get_username().lower(), created_by=instance, slug=instance.get_username().lower(), online=True
        )
    instance.vendor.save()
