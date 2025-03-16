from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Custom User model with email as the unique identifier."""
    
    # User roles
    STUDENT = 'student'
    EXPERT = 'expert'
    ADMIN = 'admin'
    
    ROLE_CHOICES = [
        (STUDENT, 'Student'),
        (EXPERT, 'Expert'),
        (ADMIN, 'Admin'),
    ]
    
    username = None
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=STUDENT)
    gender = models.CharField(max_length=10, choices=[('male', 'Male'), ('female', 'Female')], blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_verified = models.BooleanField(default=False, help_text="Designates whether this user has verified their email address.")
    
    # Test scores (in percentage)
    gat_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="General Aptitude Test score in percentage")
    saath_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Scholastic Achievement Test score in percentage")
    high_school_gpa = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="High School Grade Point Average in percentage")
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()
    
    def __str__(self):
        return self.email
    
    @property
    def is_student(self):
        return self.role == self.STUDENT
    
    @property
    def is_expert(self):
        return self.role == self.EXPERT
    
    @property
    def is_admin(self):
        return self.role == self.ADMIN


class ExpertInvitation(models.Model):
    """Model for storing expert invitation tokens."""
    
    email = models.EmailField(unique=True)
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Invitation for {self.email}"
    
    @property
    def is_expired(self):
        from django.utils import timezone
        return self.expires_at < timezone.now() or self.is_used


class PasswordResetToken(models.Model):
    """Model for storing password reset tokens."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Password reset token for {self.user.email}"
    
    @property
    def is_expired(self):
        from django.utils import timezone
        return self.expires_at < timezone.now() or self.is_used


class VerificationCode(models.Model):
    """Model for storing verification codes."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='verification_codes')
    code = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Verification code for {self.user.email}"
    
    @property
    def is_expired(self):
        from django.utils import timezone
        return self.expires_at < timezone.now() or self.is_used 