from rest_framework import serializers
from .models import Lecture, LectureRegistration
from users.serializers import UserSerializer


class LectureSerializer(serializers.ModelSerializer):
    """Serializer for the Lecture model."""
    
    duration = serializers.CharField(read_only=True)
    scheduled_for = serializers.CharField(read_only=True)
    registration_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Lecture
        fields = [
            'id', 'title', 'description', 'date', 'start_time', 'end_time',
            'location', 'lecture_url', 'expert_name', 'created_at',
            'updated_at', 'tags', 'status', 'zoom_link', 'duration',
            'scheduled_for', 'registration_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_registration_count(self, obj):
        """Get the number of registrations for the lecture."""
        return obj.registrations.count()


class LectureRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for the LectureRegistration model."""
    
    student = UserSerializer(read_only=True)
    lecture = LectureSerializer(read_only=True)
    lecture_id = serializers.PrimaryKeyRelatedField(
        source='lecture',
        queryset=Lecture.objects.all(),
        write_only=True
    )
    
    class Meta:
        model = LectureRegistration
        fields = ['id', 'lecture', 'lecture_id', 'student', 'registered_at', 'attended']
        read_only_fields = ['id', 'registered_at', 'attended']
    
    def create(self, validated_data):
        """Create a new lecture registration."""
        # Get the current user from the context
        user = self.context['request'].user
        
        # Check if the user is a student
        if user.role != 'student':
            raise serializers.ValidationError("Only students can register for lectures.")
        
        # Check if the user is already registered for this lecture
        lecture = validated_data['lecture']
        if LectureRegistration.objects.filter(lecture=lecture, student=user).exists():
            raise serializers.ValidationError("You are already registered for this lecture.")
        
        # Create the registration
        return LectureRegistration.objects.create(lecture=lecture, student=user) 