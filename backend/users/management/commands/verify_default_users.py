from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Marks the default users (admin, student, expert) as verified'

    def handle(self, *args, **kwargs):
        self.stdout.write('Verifying default users...')
        
        # Default emails
        default_emails = ['admin@example.com', 'student@example.com', 'expert@example.com']
        
        for email in default_emails:
            try:
                user = User.objects.get(email=email)
                user.is_verified = True
                user.save()
                self.stdout.write(self.style.SUCCESS(f'User {email} marked as verified'))
            except User.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'User {email} not found'))
        
        # Also verify any additional student users
        additional_emails = ['student1@example.com', 'student2@example.com']
        for email in additional_emails:
            try:
                user = User.objects.get(email=email)
                user.is_verified = True
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Additional user {email} marked as verified'))
            except User.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Additional user {email} not found'))
        
        self.stdout.write(self.style.SUCCESS('Default users verification completed')) 