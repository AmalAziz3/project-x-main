from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from .models import ExpertInvitation, PasswordResetToken, VerificationCode
from .utils import generate_token, generate_verification_code, send_password_reset_email, send_verification_code_email
import uuid
from datetime import timedelta
from django.utils import timezone

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'gender', 'date_of_birth', 
                 'gat_score', 'saath_score', 'high_school_gpa', 'is_verified']
        read_only_fields = ['id', 'role', 'is_verified']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile updates."""
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'gender', 'date_of_birth',
                 'gat_score', 'saath_score', 'high_school_gpa']
        read_only_fields = ['id', 'email', 'role']
    
    def validate_gat_score(self, value):
        if value is not None and (value < 0 or value > 100):
            raise serializers.ValidationError("GAT score must be between 0 and 100")
        return value
    
    def validate_saath_score(self, value):
        if value is not None and (value < 0 or value > 100):
            raise serializers.ValidationError("SAATH score must be between 0 and 100")
        return value
    
    def validate_high_school_gpa(self, value):
        if value is not None and (value < 0 or value > 100):
            raise serializers.ValidationError("High School GPA must be between 0 and 100")
        return value


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'gender', 'date_of_birth', 'role',
                 'gat_score', 'saath_score', 'high_school_gpa']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'gender': {'required': True},
            'date_of_birth': {'required': False},
            'gat_score': {'required': False},
            'saath_score': {'required': False},
            'high_school_gpa': {'required': False}
        }
    
    def validate(self, attrs):
        print("RegisterSerializer validate method called with attrs:", attrs)
        # Only students can self-register
        if attrs.get('role') != User.STUDENT and not self.context.get('is_admin', False):
            raise serializers.ValidationError({"role": "Only students can register through this endpoint."})
        
        # Ensure gender is provided
        if not attrs.get('gender'):
            print("Gender validation failed: gender not provided or empty")
            raise serializers.ValidationError({"gender": "Gender is required."})
            
        print("Gender validation passed with value:", attrs.get('gender'))
        return attrs
    
    def create(self, validated_data):
        print("RegisterSerializer create method called with validated_data:", validated_data)
        validated_data['is_verified'] = True  # Set all users as verified by default
        user = User.objects.create_user(**validated_data)
        return user


class ExpertInvitationSerializer(serializers.ModelSerializer):
    """Serializer for expert invitations."""
    
    class Meta:
        model = ExpertInvitation
        fields = ['id', 'email', 'token', 'created_at', 'expires_at', 'is_used']
        read_only_fields = ['id', 'token', 'created_at', 'expires_at', 'is_used']
    
    def create(self, validated_data):
        # Generate a unique token
        token = str(uuid.uuid4())
        
        # Set expiration date (default: 7 days from now)
        expires_at = timezone.now() + timedelta(days=7)
        
        # Create the invitation
        invitation = ExpertInvitation.objects.create(
            email=validated_data['email'],
            token=token,
            expires_at=expires_at
        )
        
        return invitation


class ExpertRegisterSerializer(serializers.ModelSerializer):
    """Serializer for expert registration using invitation token."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'read_only': True}
        }
    
    def create(self, validated_data):
        invitation = self.context.get('invitation')
        
        # Create the expert user
        user = User.objects.create_user(
            email=invitation.email,
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=User.EXPERT,
            is_verified=True  # Automatically verify expert users
        )
        
        # Mark the invitation as used
        invitation.is_used = True
        invitation.save()
        
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        # Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "No user found with this email address."})
        
        # Automatically verify the user if they're not already verified
        if not user.is_verified:
            user.is_verified = True
            user.save()
        
        # Authenticate user
        user = authenticate(email=email, password=password)
        if not user:
            raise serializers.ValidationError({"password": "Invalid credentials."})
        
        attrs['user'] = user
        return attrs


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request."""
    
    email = serializers.EmailField()
    
    def validate_email(self, value):
        """Validate that the email exists."""
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address.")
        return value
    
    def save(self):
        """Create a password reset token and send email."""
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        
        # Invalidate any existing tokens
        PasswordResetToken.objects.filter(user=user, is_used=False).update(is_used=True)
        
        # Create new token
        token = generate_token()
        expires_at = timezone.now() + timedelta(hours=24)
        reset_token = PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
        
        # Send email
        send_password_reset_email(user, token)
        
        return reset_token


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation."""
    
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        """Validate token and passwords."""
        token = data.get('token')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        
        # Check if token exists and is valid
        try:
            reset_token = PasswordResetToken.objects.get(token=token, is_used=False)
            if reset_token.is_expired:
                raise serializers.ValidationError({"token": "This password reset token has expired."})
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError({"token": "Invalid or expired password reset token."})
        
        # Check if passwords match
        if password != confirm_password:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        return data
    
    def save(self):
        """Reset the user's password."""
        token = self.validated_data['token']
        password = self.validated_data['password']
        
        reset_token = PasswordResetToken.objects.get(token=token, is_used=False)
        user = reset_token.user
        
        # Set new password
        user.set_password(password)
        user.save()
        
        # Mark token as used
        reset_token.is_used = True
        reset_token.save()
        
        return user


class VerificationCodeRequestSerializer(serializers.Serializer):
    """Serializer for verification code request."""
    
    email = serializers.EmailField()
    
    def validate_email(self, value):
        """Validate that the email exists."""
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("No user found with this email address.")
        return value
    
    def save(self):
        """Create a verification code and send email."""
        email = self.validated_data['email']
        user = User.objects.get(email=email)
        
        # Invalidate any existing codes
        VerificationCode.objects.filter(user=user, is_used=False).update(is_used=True)
        
        # Create new code
        code = generate_verification_code()
        expires_at = timezone.now() + timedelta(minutes=15)
        verification_code = VerificationCode.objects.create(
            user=user,
            code=code,
            expires_at=expires_at
        )
        
        # Send email
        send_verification_code_email(user, code)
        
        return verification_code


class VerificationCodeConfirmSerializer(serializers.Serializer):
    """Serializer for verification code confirmation."""
    
    email = serializers.EmailField()
    code = serializers.CharField()
    
    def validate(self, data):
        """Validate email and code."""
        email = data.get('email')
        code = data.get('code')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "No user found with this email address."})
        
        # Check if code exists and is valid
        try:
            verification_code = VerificationCode.objects.filter(
                user=user,
                code=code,
                is_used=False
            ).latest('created_at')
            
            if verification_code.is_expired:
                raise serializers.ValidationError({"code": "This verification code has expired."})
        except VerificationCode.DoesNotExist:
            raise serializers.ValidationError({"code": "Invalid or expired verification code."})
        
        data['user'] = user
        data['verification_code'] = verification_code
        return data
    
    def save(self):
        """Mark verification code as used."""
        verification_code = self.validated_data['verification_code']
        verification_code.is_used = True
        verification_code.save()
        
        # Mark user as verified
        user = self.validated_data['user']
        user.is_verified = True
        user.save()
        
        return self.validated_data['user'] 