# Generated by Django 4.2.7 on 2025-03-14 04:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Lecture',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('date', models.DateField()),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('location', models.CharField(max_length=200)),
                ('capacity', models.PositiveIntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('tags', models.JSONField(blank=True, default=list)),
                ('status', models.CharField(choices=[('Upcoming', 'Upcoming'), ('In Progress', 'In Progress'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled')], default='Upcoming', max_length=20)),
                ('zoom_link', models.URLField(blank=True, null=True)),
                ('expert', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='lectures', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['date', 'start_time'],
            },
        ),
        migrations.CreateModel(
            name='LectureRegistration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('registered_at', models.DateTimeField(auto_now_add=True)),
                ('attended', models.BooleanField(default=False)),
                ('lecture', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='registrations', to='lecture_management.lecture')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lecture_registrations', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-registered_at'],
                'unique_together': {('lecture', 'student')},
            },
        ),
    ]
