# Generated by Django 4.2.7 on 2025-02-28 18:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('announcements', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lecturelink',
            name='description',
            field=models.TextField(blank=True),
        ),
    ]
