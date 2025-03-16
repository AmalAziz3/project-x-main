from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, F, Q
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from users.models import User
from questionnaire.models import QuestionnaireResult, Major
from announcements.models import Announcement
from .serializers import (
    TimeSeriesDataSerializer,
    DistributionDataSerializer,
    SystemStatsSerializer
)


class IsAdmin(permissions.BasePermission):
    """Permission to only allow admins to access the view."""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin


class QuestionnaireStatsView(APIView):
    """View for questionnaire completion statistics over time."""
    
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request):
        # Get time range from query parameters (default: last 30 days)
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now().date() - timedelta(days=days)
        
        # Get questionnaire results grouped by date
        results = QuestionnaireResult.objects.filter(
            date_taken__date__gte=start_date
        ).annotate(
            date=TruncDate('date_taken')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')
        
        # Serialize the data
        serializer = TimeSeriesDataSerializer(results, many=True)
        
        return Response(serializer.data)


class GenderDistributionView(APIView):
    """View for gender distribution of students who took the questionnaire."""
    
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request):
        # Get students who took the questionnaire
        student_ids = QuestionnaireResult.objects.values_list('user_id', flat=True).distinct()
        
        # Count students by gender
        gender_counts = User.objects.filter(
            id__in=student_ids
        ).values('gender').annotate(
            count=Count('id')
        ).order_by('gender')
        
        # Calculate total for percentages
        total = sum(item['count'] for item in gender_counts)
        
        # Format the data
        data = []
        for item in gender_counts:
            gender = item['gender'] if item['gender'] else 'Not specified'
            percentage = (item['count'] / total * 100) if total > 0 else 0
            
            data.append({
                'label': gender,
                'count': item['count'],
                'percentage': round(percentage, 2)
            })
        
        # Serialize the data
        serializer = DistributionDataSerializer(data, many=True)
        
        return Response(serializer.data)


class MajorDistributionView(APIView):
    """View for major distribution of questionnaire results."""
    
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request):
        # Count results by major
        major_counts = QuestionnaireResult.objects.values(
            'major_id', 'major__name'
        ).annotate(
            count=Count('id')
        ).order_by('-count')
        
        # Calculate total for percentages
        total = sum(item['count'] for item in major_counts)
        
        # Format the data
        data = []
        for item in major_counts:
            percentage = (item['count'] / total * 100) if total > 0 else 0
            
            data.append({
                'label': item['major__name'],
                'count': item['count'],
                'percentage': round(percentage, 2)
            })
        
        # Serialize the data
        serializer = DistributionDataSerializer(data, many=True)
        
        return Response(serializer.data)


class SystemStatsView(APIView):
    """View for overall system statistics."""
    
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get(self, request):
        # Count various entities
        total_students = User.objects.filter(role=User.STUDENT).count()
        total_experts = User.objects.filter(role=User.EXPERT).count()
        total_questionnaires = QuestionnaireResult.objects.count()
        total_announcements = Announcement.objects.count()
        
        # Format the data
        data = {
            'total_students': total_students,
            'total_experts': total_experts,
            'total_questionnaires': total_questionnaires,
            'total_announcements': total_announcements
        }
        
        # Serialize the data
        serializer = SystemStatsSerializer(data)
        
        return Response(serializer.data) 