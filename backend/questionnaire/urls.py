from django.urls import path
from .views import (
    QuestionListView,
    SubmitQuestionnaireView,
    UserResultsView,
    UserResultDetailView,
)

urlpatterns = [
    path('questions/', QuestionListView.as_view(), name='question_list'),
    path('submit/', SubmitQuestionnaireView.as_view(), name='submit_questionnaire'),
    path('results/', UserResultsView.as_view(), name='user_results'),
    path('results/<int:pk>/', UserResultDetailView.as_view(), name='result_detail'),
] 