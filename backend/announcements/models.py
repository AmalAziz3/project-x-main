from django.db import models
from django.conf import settings


class Announcement(models.Model):
    """Model for announcements posted by Experts and Admins."""
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='announcements', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_pinned = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-is_pinned', '-created_at']
    
    def __str__(self):
        return self.title
    
    @property
    def is_edited(self):
        return self.created_at != self.updated_at


class LectureLink(models.Model):
    """Model for lecture links attached to announcements."""
    
    announcement = models.ForeignKey(Announcement, related_name='lecture_links', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    url = models.URLField()
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.title 