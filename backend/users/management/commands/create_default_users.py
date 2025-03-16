from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from datetime import date

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates default users for testing (admin, student, expert) with complete profiles'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating default users with complete profiles...')
        
        # Default passwords
        default_password = 'password123'
        
        # Create admin user
        try:
            admin_user = User.objects.create_superuser(
                email='admin@example.com',
                password=default_password,
                first_name='Admin',
                last_name='User',
                role='admin',
                gender='male',
                date_of_birth=date(1985, 5, 15),
                is_verified=True
            )
            self.stdout.write(self.style.SUCCESS(f'Admin user created: {admin_user.email}'))
        except IntegrityError:
            self.stdout.write(self.style.WARNING('Admin user already exists'))
            # Update existing admin user
            try:
                admin_user = User.objects.get(email='admin@example.com')
                admin_user.first_name = 'Admin'
                admin_user.last_name = 'User'
                admin_user.role = 'admin'
                admin_user.gender = 'male'
                admin_user.date_of_birth = date(1985, 5, 15)
                admin_user.is_verified = True
                admin_user.save()
                self.stdout.write(self.style.SUCCESS(f'Admin user updated: {admin_user.email}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to update admin user: {e}'))
        
        # Create student user
        try:
            student_user = User.objects.create_user(
                email='student@example.com',
                password=default_password,
                first_name='Student',
                last_name='User',
                role='student',
                gender='female',
                date_of_birth=date(2000, 8, 20),
                gat_score=85.5,
                saath_score=92.3,
                high_school_gpa=88.7,
                is_verified=True
            )
            self.stdout.write(self.style.SUCCESS(f'Student user created: {student_user.email}'))
        except IntegrityError:
            self.stdout.write(self.style.WARNING('Student user already exists'))
            # Update existing student user
            try:
                student_user = User.objects.get(email='student@example.com')
                student_user.first_name = 'Student'
                student_user.last_name = 'User'
                student_user.role = 'student'
                student_user.gender = 'female'
                student_user.date_of_birth = date(2000, 8, 20)
                student_user.gat_score = 85.5
                student_user.saath_score = 92.3
                student_user.high_school_gpa = 88.7
                student_user.is_verified = True
                student_user.save()
                self.stdout.write(self.style.SUCCESS(f'Student user updated: {student_user.email}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to update student user: {e}'))
        
        # Create expert user
        try:
            expert_user = User.objects.create_user(
                email='expert@example.com',
                password=default_password,
                first_name='Expert',
                last_name='User',
                role='expert',
                gender='male',
                date_of_birth=date(1978, 3, 10),
                is_verified=True
            )
            self.stdout.write(self.style.SUCCESS(f'Expert user created: {expert_user.email}'))
        except IntegrityError:
            self.stdout.write(self.style.WARNING('Expert user already exists'))
            # Update existing expert user
            try:
                expert_user = User.objects.get(email='expert@example.com')
                expert_user.first_name = 'Expert'
                expert_user.last_name = 'User'
                expert_user.role = 'expert'
                expert_user.gender = 'male'
                expert_user.date_of_birth = date(1978, 3, 10)
                expert_user.is_verified = True
                expert_user.save()
                self.stdout.write(self.style.SUCCESS(f'Expert user updated: {expert_user.email}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to update expert user: {e}'))
        
        # Create additional student users with varying scores for testing
        try:
            student1 = User.objects.create_user(
                email='student1@example.com',
                password=default_password,
                first_name='Alex',
                last_name='Johnson',
                role='student',
                gender='male',
                date_of_birth=date(2001, 4, 15),
                gat_score=78.2,
                saath_score=85.1,
                high_school_gpa=82.5,
                is_verified=True
            )
            self.stdout.write(self.style.SUCCESS(f'Additional student created: {student1.email}'))
        except IntegrityError:
            self.stdout.write(self.style.WARNING('Student1 already exists'))
        
        try:
            student2 = User.objects.create_user(
                email='student2@example.com',
                password=default_password,
                first_name='Sarah',
                last_name='Williams',
                role='student',
                gender='female',
                date_of_birth=date(1999, 11, 8),
                gat_score=92.7,
                saath_score=94.5,
                high_school_gpa=95.2,
                is_verified=True
            )
            self.stdout.write(self.style.SUCCESS(f'Additional student created: {student2.email}'))
        except IntegrityError:
            self.stdout.write(self.style.WARNING('Student2 already exists'))
            
        self.stdout.write(self.style.SUCCESS('Default users creation/update completed')) 