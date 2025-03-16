from django.db import models
from django.conf import settings


class Major(models.Model):
    """Model for academic majors."""
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    
    def __str__(self):
        return self.name


class Question(models.Model):
    """Model for questionnaire questions."""
    
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"Question {self.order}: {self.text[:50]}..."


class Choice(models.Model):
    """Model for question choices."""
    
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    
    def __str__(self):
        return self.text


class MajorWeight(models.Model):
    """Model for mapping choices to majors with weights."""
    
    choice = models.ForeignKey(Choice, related_name='major_weights', on_delete=models.CASCADE)
    major = models.ForeignKey(Major, related_name='choice_weights', on_delete=models.CASCADE)
    weight = models.FloatField(default=0.0)
    
    class Meta:
        unique_together = ['choice', 'major']
    
    def __str__(self):
        return f"{self.choice} -> {self.major} ({self.weight})"


class QuestionnaireResult(models.Model):
    """Model for storing user questionnaire results."""
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='questionnaire_results', on_delete=models.CASCADE)
    major = models.ForeignKey(Major, related_name='user_results', on_delete=models.CASCADE)
    score = models.FloatField()
    date_taken = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date_taken']
    
    def __str__(self):
        return f"{self.user.email} - {self.major.name} ({self.score})"


class UserResponse(models.Model):
    """Model for storing individual user responses to questions."""
    
    result = models.ForeignKey(QuestionnaireResult, related_name='responses', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ['result', 'question']
    
    def __str__(self):
        return f"{self.result.user.email} - Q{self.question.order}: {self.choice.text[:30]}..." 