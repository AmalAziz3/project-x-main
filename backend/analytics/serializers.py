from rest_framework import serializers


class TimeSeriesDataSerializer(serializers.Serializer):
    """Serializer for time series data."""
    
    date = serializers.DateField()
    count = serializers.IntegerField()


class DistributionDataSerializer(serializers.Serializer):
    """Serializer for distribution data."""
    
    label = serializers.CharField()
    count = serializers.IntegerField()
    percentage = serializers.FloatField()


class SystemStatsSerializer(serializers.Serializer):
    """Serializer for system statistics."""
    
    total_students = serializers.IntegerField()
    total_experts = serializers.IntegerField()
    total_questionnaires = serializers.IntegerField()
    total_announcements = serializers.IntegerField() 