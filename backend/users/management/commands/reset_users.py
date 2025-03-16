from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Deletes all users and recreates default users for testing (admin, student, expert)'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting all existing users...')
        User.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('All users deleted'))
        
        # Default passwords
        default_password = 'password123'
        
        # Create admin user
        admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password=default_password,
            first_name='Admin',
            last_name='User',
            role='admin',
            is_verified=True
        )
        self.stdout.write(self.style.SUCCESS(f'Admin user created: {admin_user.email}'))
        
        # Create student user
        student_user = User.objects.create_user(
            email='student@example.com',
            password=default_password,
            first_name='Student',
            last_name='User',
            role='student',
            gender='male',
            is_verified=True
        )
        self.stdout.write(self.style.SUCCESS(f'Student user created: {student_user.email}'))
        
        # Create expert user
        expert_user = User.objects.create_user(
            email='expert@example.com',
            password=default_password,
            first_name='Expert',
            last_name='User',
            role='expert',
            is_verified=True
        )
        self.stdout.write(self.style.SUCCESS(f'Expert user created: {expert_user.email}'))
            
        self.stdout.write(self.style.SUCCESS('Default users creation completed')) 