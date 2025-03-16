from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Announcement
from .serializers import (
    AnnouncementSerializer,
    AnnouncementCreateSerializer,
    AnnouncementUpdateSerializer
)


class IsExpertOrAdmin(permissions.BasePermission):
    """Permission to only allow experts and admins to create/edit announcements."""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.is_expert or request.user.is_admin)


class IsOwnerOrAdmin(permissions.BasePermission):
    """Permission to only allow owners or admins to edit/delete announcements."""
    
    def has_object_permission(self, request, view, obj):
        # Admin can edit/delete any announcement
        if request.user.is_admin:
            return True
        
        # Experts can only edit/delete their own announcements
        return request.user.is_expert and obj.author == request.user


class AnnouncementListView(generics.ListAPIView):
    """View for listing all announcements."""
    
    queryset = Announcement.objects.all().order_by('-is_pinned', '-created_at')
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]


class AnnouncementDetailView(generics.RetrieveAPIView):
    """View for retrieving a specific announcement."""
    
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.IsAuthenticated]


class AnnouncementCreateView(generics.CreateAPIView):
    """View for creating a new announcement."""
    
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsExpertOrAdmin]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AnnouncementUpdateView(generics.UpdateAPIView):
    """View for updating an announcement."""
    
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsExpertOrAdmin, IsOwnerOrAdmin]


class AnnouncementDeleteView(generics.DestroyAPIView):
    """View for deleting an announcement."""
    
    queryset = Announcement.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsExpertOrAdmin, IsOwnerOrAdmin] 