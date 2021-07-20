# Generated by Django 3.2.3 on 2021-07-18 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0012_auto_20210718_1513'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='condition',
            field=models.PositiveIntegerField(choices=[(5, 'Mint'), (4, 'New'), (3, 'Good'), (2, 'Fair'), (1, 'Damaged')], default=3),
        ),
    ]