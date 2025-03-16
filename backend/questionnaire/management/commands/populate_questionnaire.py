from django.core.management.base import BaseCommand
from questionnaire.models import Major, Question, Choice, MajorWeight
import json


class Command(BaseCommand):
    help = 'Populates the database with questionnaire data from the Questionnaire_logic/Questionnaire_mapping file'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting questionnaire data population...'))
        
        # Sample questionnaire data based on the Questionnaire_mapping file
        questionnaire_data = {
            "questions": [
                {
                    "id": 1,
                    "question": "What subjects do you enjoy the most?",
                    "answers": [
                        {
                            "choice": "Mathematics & Logic",
                            "majors": ["Mathematics", "Physics", "Computer Science", "Engineering", "Statistics", "Data Science"],
                            "weight": 10
                        },
                        {
                            "choice": "Natural Sciences",
                            "majors": ["Biology", "Chemistry", "Environmental Science", "Medicine", "Neuroscience", "Agricultural Science"],
                            "weight": 10
                        },
                        {
                            "choice": "Arts & Design",
                            "majors": ["Fine Arts", "Graphic Design", "Architecture", "Industrial Design", "Film & Media Studies", "Fashion Design"],
                            "weight": 10
                        },
                        {
                            "choice": "Social Sciences",
                            "majors": ["Psychology", "Sociology", "Political Science", "Anthropology", "International Relations", "Law"],
                            "weight": 10
                        }
                    ]
                },
                {
                    "id": 2,
                    "question": "How do you prefer to solve problems?",
                    "answers": [
                        {
                            "choice": "Logical analysis",
                            "majors": ["Computer Science", "Software Engineering", "Cybersecurity", "Artificial Intelligence", "Mathematics", "Robotics"],
                            "weight": 8
                        },
                        {
                            "choice": "Creative solutions",
                            "majors": ["Design", "Architecture", "Animation", "Game Design", "Advertising", "UX/UI Design"],
                            "weight": 8
                        },
                        {
                            "choice": "Research and investigation",
                            "majors": ["Science", "Philosophy", "Data Science", "Astronomy", "Biomedical Engineering", "Forensic Science"],
                            "weight": 8
                        },
                        {
                            "choice": "Helping and mentoring",
                            "majors": ["Education", "Psychology", "Social Work", "Human Resources", "Counseling", "Speech Therapy"],
                            "weight": 8
                        }
                    ]
                },
                {
                    "id": 3,
                    "question": "What kind of projects interest you most?",
                    "answers": [
                        {
                            "choice": "Building and creating",
                            "majors": ["Engineering", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Product Design", "Robotics"],
                            "weight": 9
                        },
                        {
                            "choice": "Data analysis",
                            "majors": ["Economics", "Finance", "Statistics", "Actuarial Science", "Data Science", "Business Analytics"],
                            "weight": 9
                        },
                        {
                            "choice": "Managing and organizing",
                            "majors": ["Business", "Entrepreneurship", "Hospitality Management", "Public Administration", "Event Planning"],
                            "weight": 9
                        },
                        {
                            "choice": "Counseling & helping",
                            "majors": ["Psychology", "Social Work", "Mental Health Counseling", "Special Education", "Career Coaching"],
                            "weight": 9
                        }
                    ]
                }
            ]
        }
        
        # Create majors
        all_majors = set()
        for question in questionnaire_data['questions']:
            for answer in question['answers']:
                for major_name in answer['majors']:
                    all_majors.add(major_name)
        
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
        for q_data in questionnaire_data['questions']:
            question, created = Question.objects.get_or_create(
                order=q_data['id'],
                defaults={'text': q_data['question']}
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created question: {question.text}'))
            else:
                self.stdout.write(self.style.WARNING(f'Question already exists: {question.text}'))
            
            for answer_data in q_data['answers']:
                choice, created = Choice.objects.get_or_create(
                    question=question,
                    text=answer_data['choice']
                )
                
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created choice: {choice.text}'))
                else:
                    self.stdout.write(self.style.WARNING(f'Choice already exists: {choice.text}'))
                
                # Create major weights
                for major_name in answer_data['majors']:
                    major = major_objects[major_name]
                    weight, created = MajorWeight.objects.get_or_create(
                        choice=choice,
                        major=major,
                        defaults={'weight': answer_data['weight']}
                    )
                    
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Created weight: {choice.text} -> {major.name} ({weight.weight})'))
                    else:
                        self.stdout.write(self.style.WARNING(f'Weight already exists: {choice.text} -> {major.name}'))
        
        self.stdout.write(self.style.SUCCESS('Questionnaire data population completed successfully!')) 