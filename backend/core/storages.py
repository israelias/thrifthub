from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage
import os


class StaticStorage(S3Boto3Storage):
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    location = settings.STATICFILES_LOCATION


class MediaStorage(S3Boto3Storage):
    bucket_name = settings.AWS_STORAGE_BUCKET_NAME
    location = settings.MEDIAFILES_LOCATION if not settings.DEBUG else os.path.join(settings.BASE_DIR, "media")
    file_overwrite = False
