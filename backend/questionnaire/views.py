from rest_framework import generics, status, permissions
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Sum, F, FloatField, Count, Avg
from .models import Question, Choice, Major, MajorWeight, QuestionnaireResult, UserResponse
from .serializers import (
    QuestionSerializer,
    QuestionnaireResultSerializer,
    QuestionnaireSubmissionSerializer
)
from users.models import User
import math
import logging

# Set up logger
logger = logging.getLogger(__name__)


class IsStudent(permissions.BasePermission):
    """Permission to only allow students to access the view."""
    
    def has_permission(self, request, view):
        is_authenticated = request.user.is_authenticated
        is_student = False
        
        if is_authenticated:
            is_student = request.user.is_student
            logger.info(f"User {request.user.email} authenticated: {is_authenticated}, is_student: {is_student}")
        else:
            logger.warning("User not authenticated")
            
        return is_authenticated and is_student


class QuestionListView(generics.ListAPIView):
    """View for listing all questions with their choices."""
    
    queryset = Question.objects.all().order_by('order')
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def list(self, request, *args, **kwargs):
        logger.info(f"Fetching questions for user: {request.user.email}")
        try:
            queryset = self.filter_queryset(self.get_queryset())
            if not queryset.exists():
                logger.warning("No questions found in the database")
                return Response({"detail": "No questions available."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error fetching questions: {str(e)}")
            return Response({"detail": "An error occurred while fetching questions."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SubmitQuestionnaireView(generics.CreateAPIView):
    """View for submitting questionnaire responses and calculating major recommendations."""
    
    serializer_class = QuestionnaireSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    
    # Define question categories for more nuanced scoring
    QUESTION_CATEGORIES = {
        'core_interests': [1, 3, 9, 10],      # Core interests and activities
        'problem_solving': [2, 8],             # Problem-solving approaches
        'career_focus': [4, 7, 11, 13],        # Career and workplace preferences
        'impact_values': [5, 13],              # Impact and value preferences
        'learning_style': [6, 14, 15]          # Learning and working style
    }
    
    # Category weights to prioritize certain aspects
    CATEGORY_WEIGHTS = {
        'core_interests': 1.3,     # Interests are highly important
        'problem_solving': 1.2,    # Problem-solving is important for major selection
        'career_focus': 1.1,       # Career considerations are important
        'impact_values': 0.9,      # Values are somewhat important
        'learning_style': 1.0      # Learning style is standard weight
    }
    
    # Weight adjustment for early questions (questions 1-5 are most critical)
    def get_question_importance(self, question_id):
        """Returns an importance multiplier based on question position."""
        if 1 <= question_id <= 5:
            return 1.2  # Key initial questions
        elif 6 <= question_id <= 10:
            return 1.0  # Standard middle questions
        else:
            return 0.8  # Supplementary later questions
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """Process questionnaire submission and calculate major recommendations."""
        logger.info(f"Processing questionnaire submission for user: {request.user.email}")
        
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Get validated responses (already standardized to use question_id and choice_id)
            responses_data = serializer.validated_data['responses']
            
            # Initialize scores for all majors
            all_majors = Major.objects.all()
            major_scores = {major.id: 0 for major in all_majors}
            
            # Initialize category scores for all majors
            category_scores = {
                major.id: {category: 0 for category in self.QUESTION_CATEGORIES.keys()}
                for major in all_majors
            }
            
            # Track response counts per category for normalization
            category_response_counts = {category: 0 for category in self.QUESTION_CATEGORIES.keys()}
            
            # Process each response
            for response in responses_data:
                question_id = response['question_id']
                choice_id = response['choice_id']
                
                try:
                    # Get the question and selected choice
                    question = Question.objects.get(id=question_id)
                    choice = Choice.objects.get(id=choice_id)
                    
                    # Find which category this question belongs to
                    question_category = None
                    for category, question_ids in self.QUESTION_CATEGORIES.items():
                        if question.order in question_ids:
                            question_category = category
                            category_response_counts[category] += 1
                            break
                    
                    # Get importance multiplier for this question
                    question_importance = self.get_question_importance(question.order)
                    
                    # Get major weights for the selected choice
                    major_weights = MajorWeight.objects.filter(choice=choice)
                    
                    for weight_obj in major_weights:
                        major_id = weight_obj.major.id
                        weight = weight_obj.weight * question_importance
                        
                        # Add to the major's score
                        major_scores[major_id] += weight
                        
                        # If the question belongs to a category, add to category score
                        if question_category:
                            category_scores[major_id][question_category] += weight
                    
                except Question.DoesNotExist:
                    logger.error(f"Question ID {question_id} does not exist")
                    continue
                except Choice.DoesNotExist:
                    logger.error(f"Choice ID {choice_id} does not exist")
                    continue
            
            # Apply category weights and normalize category scores
            weighted_major_scores = {major_id: 0 for major_id in major_scores}
            
            for major_id in major_scores:
                for category, score in category_scores[major_id].items():
                    response_count = category_response_counts.get(category, 0)
                    if response_count > 0:
                        # Normalize by question count in this category then apply category weight
                        normalized_category_score = (score / response_count) * self.CATEGORY_WEIGHTS.get(category, 1.0)
                        weighted_major_scores[major_id] += normalized_category_score
            
            # Get top 5 majors
            sorted_majors = sorted(
                [(major_id, score) for major_id, score in weighted_major_scores.items()],
                key=lambda x: x[1],
                reverse=True
            )
            
            # Get the top 5 major IDs and scores
            top_majors = sorted_majors[:5]
            
            if not top_majors:
                logger.error("No majors were matched with the questionnaire responses")
                return Response(
                    {"detail": "Could not determine major recommendations based on responses."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate confidence levels (normalize to percentages)
            max_score = max(score for _, score in top_majors)
            confidence_levels = []
            
            for major_id, score in top_majors:
                # Normalize to a percentage (0-100)
                if max_score > 0:
                    confidence = min(round((score / max_score) * 100), 100)
                else:
                    confidence = 0
                
                confidence_levels.append((major_id, confidence))
            
            # Create QuestionnaireResult objects for the top majors
            results = []
            for major_id, confidence in confidence_levels:
                major = Major.objects.get(id=major_id)
                
                # Create the result object
                result = QuestionnaireResult.objects.create(
                    user=request.user,
                    major=major,
                    score=confidence
                )
                results.append(result)
                
                # Store individual responses
                for response in responses_data:
                    question = Question.objects.get(id=response['question_id'])
                    choice = Choice.objects.get(id=response['choice_id'])
                    
                    UserResponse.objects.create(
                        result=result,
                        question=question,
                        choice=choice
                    )
            
            # Return the serialized results
            return Response(
                QuestionnaireResultSerializer.format_results(results),
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            logger.error(f"Error processing questionnaire: {str(e)}")
            return Response(
                {"detail": f"An error occurred while processing your responses: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserResultsView(generics.ListAPIView):
    """View for listing a user's questionnaire results."""
    
    serializer_class = QuestionnaireResultSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    
    def get_queryset(self):
        return QuestionnaireResult.objects.filter(user=self.request.user)


class UserResultDetailView(generics.RetrieveAPIView):
    """View for retrieving a specific questionnaire result."""
    
    serializer_class = QuestionnaireResultSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    
    def get_queryset(self):
        return QuestionnaireResult.objects.filter(user=self.request.user) 