from django.urls import path
from .views import (
    QuestionnaireStatsView,
    GenderDistributionView,
    MajorDistributionView,
    SystemStatsView,
)

urlpatterns = [
    path('questionnaire-stats/', QuestionnaireStatsView.as_view(), name='questionnaire_stats'),
    path('gender-distribution/', GenderDistributionView.as_view(), name='gender_distribution'),
    path('major-distribution/', MajorDistributionView.as_view(), name='major_distribution'),
    path('system-stats/', SystemStatsView.as_view(), name='system_stats'),
] 