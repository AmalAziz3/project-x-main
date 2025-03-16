import secrets
import string
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.urls import reverse


def generate_token(length=32):
    """Generate a secure random token."""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def send_password_reset_email(user, token):
    """Send password reset email with token."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{token}/"
    
    # Create email content
    subject = "Reset Your Password"
    html_message = render_to_string('users/password_reset_email.html', {
        'user': user,
        'reset_url': reset_url,
        'valid_hours': 24,
    })
    plain_message = strip_tags(html_message)
    
    # Send email
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )


def send_verification_code_email(user, code):
    """Send verification code email."""
    subject = "Your Verification Code"
    html_message = render_to_string('users/verification_code_email.html', {
        'user': user,
        'code': code,
        'valid_minutes': 15,
    })
    plain_message = strip_tags(html_message)
    
    # Print email details for logging and debugging with more visibility
    print("="*50)
    print(f"VERIFICATION CODE for {user.email}: {code}")
    print(f"This code will be valid for 15 minutes")
    print("="*50)
    
    # Comment out email sending for now due to authentication issues
    """
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,
        fail_silently=False,
    )
    """


def generate_verification_code(length=6):
    """Generate a numeric verification code."""
    return ''.join(secrets.choice(string.digits) for _ in range(length)) 