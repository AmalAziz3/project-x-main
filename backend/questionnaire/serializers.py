from rest_framework import serializers
from .models import Major, Question, Choice, MajorWeight, QuestionnaireResult, UserResponse


class MajorSerializer(serializers.ModelSerializer):
    """Serializer for the Major model."""
    
    class Meta:
        model = Major
        fields = ['id', 'name', 'description']


class ChoiceSerializer(serializers.ModelSerializer):
    """Serializer for the Choice model."""
    
    class Meta:
        model = Choice
        fields = ['id', 'text']


class QuestionSerializer(serializers.ModelSerializer):
    """Serializer for the Question model with choices."""
    
    choices = ChoiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'choices']


class UserResponseSerializer(serializers.ModelSerializer):
    """Serializer for the UserResponse model."""
    
    question_text = serializers.CharField(source='question.text', read_only=True)
    choice_text = serializers.CharField(source='choice.text', read_only=True)
    
    class Meta:
        model = UserResponse
        fields = ['id', 'question', 'question_text', 'choice', 'choice_text']
        read_only_fields = ['id', 'question_text', 'choice_text']


class TopMajorSerializer(serializers.Serializer):
    """Serializer for top major recommendations."""
    
    id = serializers.IntegerField()
    name = serializers.CharField()
    confidence = serializers.FloatField()


class CategoryBreakdownSerializer(serializers.Serializer):
    """Serializer for category breakdown data."""
    
    category = serializers.CharField()
    score = serializers.FloatField()
    weight = serializers.FloatField()


class QuestionnaireResultSerializer(serializers.ModelSerializer):
    """Serializer for questionnaire results."""
    
    major = MajorSerializer(read_only=True)
    responses = serializers.SerializerMethodField()
    
    class Meta:
        model = QuestionnaireResult
        fields = ['id', 'user', 'major', 'score', 'date_taken', 'responses']
    
    def get_responses(self, obj):
        user_responses = UserResponse.objects.filter(result=obj)
        return UserResponseSerializer(user_responses, many=True).data
    
    @classmethod
    def format_results(cls, results):
        """Format a list of QuestionnaireResult objects into a response."""
        if not results:
            return {"detail": "No results available."}
        
        # Get primary result (highest score)
        primary_result = results[0]
        serializer = cls(primary_result)
        result_data = serializer.data
        
        # Add all top majors
        top_majors = []
        for result in results:
            top_majors.append({
                'id': result.major.id,
                'name': result.major.name,
                'confidence': result.score
            })
        
        result_data['top_majors'] = top_majors
        
        return result_data


class QuestionnaireSubmissionSerializer(serializers.Serializer):
    """Serializer for submitting questionnaire responses."""
    
    responses = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField(),
            allow_empty=False
        ),
        min_length=1
    )
    
    def validate_responses(self, value):
        """Validate that responses contain valid question and choice IDs."""
        validated_responses = []
        
        for response in value:
            # Handle both field naming conventions for compatibility
            question_id = None
            choice_id = None
            
            # Check if using new field names
            if 'question_id' in response and 'choice_id' in response:
                question_id = response['question_id']
                choice_id = response['choice_id']
            # Check if using old field names
            elif 'question' in response and 'choice' in response:
                question_id = response['question']
                choice_id = response['choice']
            else:
                raise serializers.ValidationError(
                    "Each response must include question and choice IDs ('question' and 'choice' or 'question_id' and 'choice_id')."
                )
            
            # Verify question exists
            try:
                question = Question.objects.get(id=question_id)
            except Question.DoesNotExist:
                raise serializers.ValidationError(f"Question with ID {question_id} does not exist.")
            
            # Verify choice exists and belongs to the question
            try:
                choice = Choice.objects.get(id=choice_id)
                if choice.question.id != question.id:
                    raise serializers.ValidationError(
                        f"Choice with ID {choice_id} does not belong to question with ID {question_id}."
                    )
            except Choice.DoesNotExist:
                raise serializers.ValidationError(f"Choice with ID {choice_id} does not exist.")
            
            # Add to validated responses with consistent field names for the view to use
            validated_responses.append({
                'question_id': question_id,
                'choice_id': choice_id
            })
        
        return validated_responses 