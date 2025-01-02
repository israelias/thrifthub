from django.contrib.auth.models import AbstractUser, User
from django.db.models.signals import post_save
from django.dispatch import receiver
from vendor.models import Vendor


@receiver(post_save, sender=User)
def create_or_update_vendor(sender, instance, created, **kwargs):
    """
    The create_or_update_vendor function is called whenever a User instance is created or updated.
    It creates an associated Vendor instance with the same username as the User, and sets it to online.
    If a Vendor already exists for this user, it simply updates that vendor's slug field.

    Args:
        sender: Determine which model is sending the signal
        instance: Pass the instance of the user that was just created
        created: Determine if the user was created or just updated
        **kwargs: Catch any additional keyword arguments that are passed to the function

    Returns:
        The vendor instance
    """
    print("RECEIVER")
    print("SENDER", sender.username)
    print("INSTANCE", instance)
    print("CREATED", created)
    if created:
        Vendor.objects.create(
            name=instance.get_username().lower(),
            created_by=instance,
            slug=instance.get_username().lower(),
            online=True,
        )
    instance.vendor.save()
