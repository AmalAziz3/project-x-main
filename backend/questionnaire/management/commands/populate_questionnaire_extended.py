from django.core.management.base import BaseCommand
from questionnaire.models import Major, Question, Choice, MajorWeight
import re


class Command(BaseCommand):
    help = 'Populates the database with the extended 20-question questionnaire from questions20.txt'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting extended questionnaire data population...'))
        
        # Parse the questions20.txt file
        questions_data = self.parse_questions_file()
        
        # Create majors
        all_majors = set()
        for question in questions_data:
            for choice in question['choices']:
                for major in choice['majors']:
                    all_majors.add(major)
        
        major_objects = {}
        for major_name in all_majors:
            major, created = Major.objects.get_or_create(
                name=major_name,
                defaults={'description': f'A degree in {major_name} prepares students for careers in various fields related to {major_name.lower()}.'}
            )
            major_objects[major_name] = major
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created major: {major_name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Major already exists: {major_name}'))
        
        # Create questions and choices
        for q_data in questions_data:
            question, created = Question.objects.get_or_create(
                order=q_data['id'],
                defaults={'text': q_data['text']}
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created question: {question.text}'))
            else:
                self.stdout.write(self.style.WARNING(f'Question already exists: {question.text}'))
                # Update the text if it's different
                if question.text != q_data['text']:
                    question.text = q_data['text']
                    question.save()
                    self.stdout.write(self.style.SUCCESS(f'Updated question text: {question.text}'))
            
            for choice_data in q_data['choices']:
                choice, created = Choice.objects.get_or_create(
                    question=question,
                    text=choice_data['text']
                )
                
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created choice: {choice.text}'))
                else:
                    self.stdout.write(self.style.WARNING(f'Choice already exists: {choice.text}'))
                
                # Create major weights
                for major_name in choice_data['majors']:
                    major = major_objects[major_name]
                    # Assign weights based on question importance
                    # Questions 1-5: Weight 10
                    # Questions 6-10: Weight 8
                    # Questions 11-15: Weight 7
                    # Questions 16-20: Weight 6
                    if q_data['id'] <= 5:
                        weight_value = 10
                    elif q_data['id'] <= 10:
                        weight_value = 8
                    elif q_data['id'] <= 15:
                        weight_value = 7
                    else:
                        weight_value = 6
                    
                    weight, created = MajorWeight.objects.get_or_create(
                        choice=choice,
                        major=major,
                        defaults={'weight': weight_value}
                    )
                    
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Created weight: {choice.text} -> {major.name} ({weight.weight})'))
                    else:
                        # Update weight if different
                        if weight.weight != weight_value:
                            weight.weight = weight_value
                            weight.save()
                            self.stdout.write(self.style.SUCCESS(f'Updated weight: {choice.text} -> {major.name} ({weight.weight})'))
                        else:
                            self.stdout.write(self.style.WARNING(f'Weight already exists: {choice.text} -> {major.name}'))
        
        self.stdout.write(self.style.SUCCESS('Extended questionnaire data population completed successfully!'))
    
    def parse_questions_file(self):
        """Parse the questions20.txt file into a structured format."""
        questions = []
        
        try:
            with open('Questionnaire_logic/questions20.txt', 'r') as file:
                content = file.read()
                
                # Split by question numbers
                question_blocks = re.split(r'\n\d+\.\s', content)
                
                # Remove any empty blocks
                question_blocks = [block for block in question_blocks if block.strip()]
                
                # Process each question block
                for i, block in enumerate(question_blocks):
                    lines = block.strip().split('\n')
                    
                    # First line is the question text
                    question_text = lines[0].strip()
                    
                    # Remaining lines are choices
                    choices = []
                    current_choice = None
                    
                    for line in lines[1:]:
                        line = line.strip()
                        if not line:
                            continue
                        
                        # Check if this is a choice line
                        choice_match = re.match(r'^-\s+(.*?)\s+→\s+(.*?)$', line)
                        if choice_match:
                            choice_text = choice_match.group(1).strip()
                            majors_text = choice_match.group(2).strip()
                            majors = [m.strip() for m in majors_text.split(',')]
                            
                            choices.append({
                                'text': choice_text,
                                'majors': majors
                            })
                    
                    questions.append({
                        'id': i + 1,
                        'text': question_text,
                        'choices': choices
                    })
                
                return questions
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR('questions20.txt file not found in Questionnaire_logic directory'))
            return []
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error parsing questions file: {str(e)}'))
            return [] 