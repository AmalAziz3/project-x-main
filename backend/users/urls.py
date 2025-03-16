from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    LoginView, 
    UserProfileView,
    ExpertInvitationView,
    ValidateTokenView,
    ExpertRegistrationView,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    VerificationCodeRequestView,
    VerificationCodeConfirmView,
)

urlpatterns = [
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    
    # Expert invitation and registration
    path('expert/invite/', ExpertInvitationView.as_view(), name='expert_invite'),
    path('expert/validate-token/<str:token>/', ValidateTokenView.as_view(), name='validate_token'),
    path('expert/register/<str:token>/', ExpertRegistrationView.as_view(), name='expert_register'),
    
    # Password reset
    path('password/reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    
    # Verification code
    path('verification/code/', VerificationCodeRequestView.as_view(), name='verification_code_request'),
    path('verification/code/confirm/', VerificationCodeConfirmView.as_view(), name='verification_code_confirm'),
] 