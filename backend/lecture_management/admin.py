from django.contrib import admin
from .models import Lecture, LectureRegistration


@admin.register(Lecture)
class LectureAdmin(admin.ModelAdmin):
    """Admin configuration for the Lecture model."""
    
    list_display = ['title', 'date', 'start_time', 'end_time', 'location', 'lecture_url', 'expert_name', 'status']
    list_filter = ['date', 'status']
    search_fields = ['title', 'description', 'location', 'expert_name']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'date', 'start_time', 'end_time', 'location', 'lecture_url', 'expert_name')
        }),
        ('Additional Information', {
            'fields': ('tags', 'status', 'zoom_link', 'created_at', 'updated_at')
        }),
    )


@admin.register(LectureRegistration)
class LectureRegistrationAdmin(admin.ModelAdmin):
    """Admin configuration for the LectureRegistration model."""
    
    list_display = ['lecture', 'student', 'registered_at', 'attended']
    list_filter = ['attended', 'registered_at']
    search_fields = ['lecture__title', 'student__email']
    readonly_fields = ['registered_at']
