from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Fixes the role values for existing users to ensure they are lowercase'

    def handle(self, *args, **kwargs):
        self.stdout.write('Fixing user roles...')
        
        # Fix admin user
        try:
            admin_user = User.objects.get(email='admin@example.com')
            if admin_user.role != 'admin':
                admin_user.role = 'admin'
                admin_user.save()
                self.stdout.write(self.style.SUCCESS(f'Fixed admin user role: {admin_user.email}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Admin user role already correct: {admin_user.email}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.WARNING('Admin user does not exist'))
        
        # Fix student user
        try:
            student_user = User.objects.get(email='student@example.com')
            if student_user.role != 'student':
                student_user.role = 'student'
                student_user.save()
                self.stdout.write(self.style.SUCCESS(f'Fixed student user role: {student_user.email}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Student user role already correct: {student_user.email}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.WARNING('Student user does not exist'))
        
        # Fix expert user
        try:
            expert_user = User.objects.get(email='expert@example.com')
            if expert_user.role != 'expert':
                expert_user.role = 'expert'
                expert_user.save()
                self.stdout.write(self.style.SUCCESS(f'Fixed expert user role: {expert_user.email}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Expert user role already correct: {expert_user.email}'))
        except User.DoesNotExist:
            self.stdout.write(self.style.WARNING('Expert user does not exist'))
            
        self.stdout.write(self.style.SUCCESS('User role fixing completed')) 