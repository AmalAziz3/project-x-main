# Generated by Django 4.0.10 on 2025-03-15 07:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lecture_management', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lecture',
            name='capacity',
        ),
        migrations.AddField(
            model_name='lecture',
            name='lecture_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]
