from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Lecture, LectureRegistration
from .serializers import LectureSerializer, LectureRegistrationSerializer
from users.permissions import IsAdminOrExpertUser


class IsAdminOrExpertOrReadOnly(permissions.BasePermission):
    """
    Permission to allow read-only access to all users,
    but only allow write access to admin and expert users.
    """
    
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS requests for all users
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Allow write access only to admin and expert users
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role == 'admin' or request.user.role == 'expert')
        )


class LectureViewSet(viewsets.ModelViewSet):
    """ViewSet for the Lecture model."""
    
    queryset = Lecture.objects.all()
    serializer_class = LectureSerializer
    permission_classes = [IsAdminOrExpertOrReadOnly]
    
    def perform_create(self, serializer):
        """Set the expert_name to the current user's name if not specified and user is an expert."""
        if self.request.user.role == 'expert' and not serializer.validated_data.get('expert_name'):
            # Use the user's full name or username if full name is not available
            expert_name = self.request.user.get_full_name() or self.request.user.username
            serializer.save(expert_name=expert_name)
        else:
            serializer.save()
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def register(self, request, pk=None):
        """Register the current user for the lecture."""
        lecture = self.get_object()
        
        # Create a serializer with the lecture and user
        serializer = LectureRegistrationSerializer(
            data={'lecture_id': lecture.id},
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def unregister(self, request, pk=None):
        """Unregister the current user from the lecture."""
        lecture = self.get_object()
        
        # Check if the user is registered for this lecture
        registration = LectureRegistration.objects.filter(
            lecture=lecture,
            student=request.user
        ).first()
        
        if not registration:
            return Response(
                {"detail": "You are not registered for this lecture."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Delete the registration
        registration.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def registrations(self, request, pk=None):
        """Get all registrations for the lecture."""
        lecture = self.get_object()
        
        # Only admins can view registrations for any lecture
        if request.user.role != 'admin':
            return Response(
                {"detail": "You do not have permission to view registrations for this lecture."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        registrations = lecture.registrations.all()
        serializer = LectureRegistrationSerializer(registrations, many=True)
        return Response(serializer.data)


class LectureRegistrationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for the LectureRegistration model."""
    
    serializer_class = LectureRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter registrations based on user role."""
        user = self.request.user
        
        if user.role == 'admin':
            # Admins can see all registrations
            return LectureRegistration.objects.all()
        elif user.role == 'expert':
            # Experts can't filter by expert anymore since it's a text field
            # They can only see their own registrations as students
            return LectureRegistration.objects.filter(student=user)
        else:
            # Students can see their own registrations
            return LectureRegistration.objects.filter(student=user)
