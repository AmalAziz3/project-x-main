from rest_framework import permissions
from django.contrib.auth import get_user_model

User = get_user_model()

class IsAdminUser(permissions.BasePermission):
    """
    Permission to only allow admin users to access the view.
    """
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')

class IsExpertUser(permissions.BasePermission):
    """
    Permission to only allow expert users to access the view.
    """
    
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'expert')

class IsAdminOrExpertUser(permissions.BasePermission):
    """
    Permission to allow both admin and expert users to access the view.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == 'admin' or request.user.role == 'expert')
        )

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission to allow users to access only their own resources or admin users to access any resource.
    """
    
    def has_object_permission(self, request, view, obj):
        # Admin can access any object
        if request.user.role == 'admin':
            return True
        
        # Check if the object has a user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # If the object is a user, check if it's the requesting user
        if isinstance(obj, User):
            return obj == request.user
        
        return False 