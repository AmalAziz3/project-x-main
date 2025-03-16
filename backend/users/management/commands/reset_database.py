from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import connection
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Reset the entire database and recreate default users'

    def add_arguments(self, parser):
        parser.add_argument(
            '--no-input', 
            action='store_true',
            help='Skip confirmation prompt'
        )

    def handle(self, *args, **options):
        if not options['no_input']:
            self.stdout.write(self.style.WARNING('WARNING: This will delete ALL data in the database!'))
            self.stdout.write(self.style.WARNING('Press Ctrl+C to cancel or any key to continue...'))
            input()

        # Get all models from all apps
        all_models = apps.get_models()
        
        # Disable foreign key constraints temporarily
        with connection.cursor() as cursor:
            cursor.execute('SET FOREIGN_KEY_CHECKS=0;' if connection.vendor == 'mysql' 
                          else 'SET CONSTRAINTS ALL DEFERRED;')
        
        # Delete data from all models except Django's internal models
        excluded_apps = ['contenttypes', 'auth', 'admin', 'sessions']
        for model in all_models:
            app_label = model._meta.app_label
            if app_label not in excluded_apps:
                model_name = model._meta.model_name
                self.stdout.write(f'Deleting all data from {app_label}.{model_name}')
                model.objects.all().delete()
        
        # Re-enable foreign key constraints
        with connection.cursor() as cursor:
            cursor.execute('SET FOREIGN_KEY_CHECKS=1;' if connection.vendor == 'mysql' 
                          else 'SET CONSTRAINTS ALL IMMEDIATE;')
        
        self.stdout.write(self.style.SUCCESS('All data has been deleted from the database'))
        
        # Create default users
        self.stdout.write('Creating default users...')
        
        # Create admin user
        admin = User.objects.create_user(
            email='admin@example.com',
            password='password123',
            first_name='Admin',
            last_name='User',
            role='admin',
            is_staff=True,
            is_superuser=True,
            is_verified=True
        )
        
        # Create student user
        student = User.objects.create_user(
            email='student@example.com',
            password='password123',
            first_name='Student',
            last_name='User',
            role='student',
            gender='male',
            is_verified=True
        )
        
        # Create expert user
        expert = User.objects.create_user(
            email='expert@example.com',
            password='password123',
            first_name='Expert',
            last_name='User',
            role='expert',
            is_verified=True
        )
        
        self.stdout.write(self.style.SUCCESS('Default users created successfully:'))
        self.stdout.write(f'Admin: {admin.email}')
        self.stdout.write(f'Student: {student.email}')
        self.stdout.write(f'Expert: {expert.email}')
        
        self.stdout.write(self.style.SUCCESS('Database reset completed successfully')) 