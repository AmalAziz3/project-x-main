from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import User, ExpertInvitation, VerificationCode
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    ExpertInvitationSerializer,
    ExpertRegisterSerializer,
    UserProfileSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    VerificationCodeRequestSerializer,
    VerificationCodeConfirmSerializer
)
from .permissions import IsAdminUser, IsExpertUser
from .utils import generate_verification_code, send_verification_code_email
from datetime import datetime, timedelta

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # All users are now verified by default
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Account created successfully.',
            }, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """View for user login."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ExpertInvitationView(generics.CreateAPIView):
    """View for creating expert invitations."""
    
    queryset = ExpertInvitation.objects.all()
    serializer_class = ExpertInvitationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        # Check if user is admin
        if not self.request.user.is_admin:
            return Response(
                {'detail': 'Only admins can create expert invitations.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if email already exists
        email = serializer.validated_data['email']
        if User.objects.filter(email=email).exists():
            return Response(
                {'detail': 'A user with this email already exists.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if an active invitation already exists
        existing_invitation = ExpertInvitation.objects.filter(
            email=email,
            is_used=False,
            expires_at__gt=timezone.now()
        ).first()
        
        if existing_invitation:
            return Response(
                {'detail': 'An active invitation already exists for this email.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer.save()
    
    def get(self, request, *args, **kwargs):
        """List all expert invitations for admin users."""
        # Check if user is admin
        if not request.user.is_admin:
            return Response(
                {'detail': 'Only admins can view expert invitations.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        invitations = ExpertInvitation.objects.all().order_by('-created_at')
        serializer = self.get_serializer(invitations, many=True)
        return Response(serializer.data)


class ValidateTokenView(APIView):
    """View for validating expert invitation tokens."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, token):
        invitation = get_object_or_404(ExpertInvitation, token=token)
        
        if invitation.is_expired:
            return Response(
                {'detail': 'This invitation has expired or has already been used.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({'email': invitation.email})


class ExpertRegistrationView(generics.CreateAPIView):
    """View for expert registration using invitation token."""
    
    serializer_class = ExpertRegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        token = self.kwargs.get('token')
        invitation = get_object_or_404(ExpertInvitation, token=token)
        
        if invitation.is_expired:
            return Response(
                {'detail': 'This invitation has expired or has already been used.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        context['invitation'] = invitation
        return context 


class ExpertInviteView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create expert user with temporary password
        user = User.objects.create_user(
            email=email,
            password='temporary',  # This should be changed by the expert on first login
            role='expert',
            is_verified=True  # Automatically verify expert users
        )
        
        # In a real application, you would send an email with a link to set password
        
        return Response({'message': f'Expert invitation sent to {email}'}, status=status.HTTP_201_CREATED)
    
    def get(self, request):
        # Return list of experts
        experts = User.objects.filter(role='expert')
        serializer = UserSerializer(experts, many=True)
        return Response(serializer.data)


class PasswordResetRequestView(APIView):
    """View for requesting a password reset."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Password reset email has been sent."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """View for confirming a password reset."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"detail": "Password has been reset successfully."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerificationCodeRequestView(APIView):
    """View for requesting a verification code."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = VerificationCodeRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Verification code has been sent to your email."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerificationCodeConfirmView(APIView):
    """View for confirming a verification code."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = VerificationCodeConfirmSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"detail": "Verification successful."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 