# Generated by Django 4.0.10 on 2025-03-15 08:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lecture_management', '0002_remove_lecture_capacity_lecture_lecture_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lecture',
            name='expert',
        ),
        migrations.AddField(
            model_name='lecture',
            name='expert_name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
