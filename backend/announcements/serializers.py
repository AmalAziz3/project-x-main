from rest_framework import serializers
from .models import Announcement, LectureLink
from users.serializers import UserSerializer


class LectureLinkSerializer(serializers.ModelSerializer):
    """Serializer for the LectureLink model."""
    
    class Meta:
        model = LectureLink
        fields = ['id', 'title', 'url', 'description']


class AnnouncementSerializer(serializers.ModelSerializer):
    """Serializer for the Announcement model."""
    
    author = UserSerializer(read_only=True)
    lecture_links = LectureLinkSerializer(many=True, read_only=True)
    is_edited = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'author', 'created_at', 'updated_at', 'is_pinned', 'is_edited', 'lecture_links']
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'is_edited']


class AnnouncementCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating announcements with lecture links."""
    
    lecture_links = LectureLinkSerializer(many=True, required=False)
    
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'is_pinned', 'lecture_links']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        lecture_links_data = validated_data.pop('lecture_links', [])
        announcement = Announcement.objects.create(**validated_data)
        
        for link_data in lecture_links_data:
            LectureLink.objects.create(announcement=announcement, **link_data)
        
        return announcement


class AnnouncementUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating announcements."""
    
    lecture_links = LectureLinkSerializer(many=True, required=False)
    
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'is_pinned', 'lecture_links']
        read_only_fields = ['id']
    
    def update(self, instance, validated_data):
        lecture_links_data = validated_data.pop('lecture_links', None)
        
        # Update announcement fields
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.is_pinned = validated_data.get('is_pinned', instance.is_pinned)
        instance.save()
        
        # Update lecture links if provided
        if lecture_links_data is not None:
            # Delete existing links
            instance.lecture_links.all().delete()
            
            # Create new links
            for link_data in lecture_links_data:
                LectureLink.objects.create(announcement=instance, **link_data)
        
        return instance 