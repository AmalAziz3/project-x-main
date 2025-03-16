from django.db import models
from django.conf import settings


class Lecture(models.Model):
    """Model for lectures in the system."""
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=200)
    lecture_url = models.URLField(blank=True, null=True)
    expert_name = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.JSONField(default=list, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('Upcoming', 'Upcoming'),
            ('In Progress', 'In Progress'),
            ('Completed', 'Completed'),
            ('Cancelled', 'Cancelled')
        ],
        default='Upcoming'
    )
    zoom_link = models.URLField(blank=True, null=True)
    
    class Meta:
        ordering = ['date', 'start_time']
    
    def __str__(self):
        return self.title
    
    @property
    def duration(self):
        """Calculate the duration of the lecture in minutes."""
        if not self.start_time or not self.end_time:
            return None
        
        start_minutes = self.start_time.hour * 60 + self.start_time.minute
        end_minutes = self.end_time.hour * 60 + self.end_time.minute
        
        # Handle case where end time is on the next day
        if end_minutes < start_minutes:
            end_minutes += 24 * 60
            
        return f"{end_minutes - start_minutes} minutes"
    
    @property
    def scheduled_for(self):
        """Format the date and time for display."""
        if not self.date or not self.start_time:
            return None
        
        return f"{self.date.strftime('%B %d, %Y')} - {self.start_time.strftime('%I:%M %p')}"


class LectureRegistration(models.Model):
    """Model for tracking student registrations for lectures."""
    
    lecture = models.ForeignKey(Lecture, related_name='registrations', on_delete=models.CASCADE)
    student = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='lecture_registrations', on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    attended = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['lecture', 'student']
        ordering = ['-registered_at']
    
    def __str__(self):
        return f"{self.student} - {self.lecture}"
