import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from lecture_management.models import Lecture

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates test lecture data'

    def handle(self, *args, **kwargs):
        # Get all expert users
        experts = User.objects.filter(role='expert')
        
        if not experts.exists():
            self.stdout.write(self.style.ERROR('No expert users found. Please create some expert users first.'))
            return
        
        # Sample lecture data
        lecture_data = [
            {
                'title': 'Introduction to React',
                'description': 'Learn the fundamentals of React including components, props, state, and hooks.',
                'date': datetime.now().date() + timedelta(days=10),
                'start_time': '14:00:00',
                'end_time': '15:00:00',
                'location': 'Online - Zoom',
                'capacity': 30,
                'tags': ['React', 'JavaScript', 'Frontend'],
                'status': 'Upcoming',
                'zoom_link': 'https://zoom.us/j/1234567890'
            },
            {
                'title': 'Advanced JavaScript Concepts',
                'description': 'Deep dive into advanced JavaScript concepts including closures, promises, and async/await.',
                'date': datetime.now().date() + timedelta(days=12),
                'start_time': '15:30:00',
                'end_time': '16:15:00',
                'location': 'Online - Zoom',
                'capacity': 25,
                'tags': ['JavaScript', 'Advanced', 'Programming'],
                'status': 'Upcoming',
                'zoom_link': 'https://zoom.us/j/0987654321'
            },
            {
                'title': 'CSS Grid and Flexbox',
                'description': 'Master modern CSS layout techniques with Grid and Flexbox.',
                'date': datetime.now().date() - timedelta(days=1),
                'start_time': '13:00:00',
                'end_time': '13:50:00',
                'location': 'Online - Zoom',
                'capacity': 20,
                'tags': ['CSS', 'Web Design', 'Frontend'],
                'status': 'Completed',
                'zoom_link': 'https://zoom.us/j/5678901234'
            },
            {
                'title': 'Python for Data Science',
                'description': 'Introduction to Python libraries for data science: NumPy, Pandas, and Matplotlib.',
                'date': datetime.now().date() + timedelta(days=15),
                'start_time': '10:00:00',
                'end_time': '11:30:00',
                'location': 'Online - Zoom',
                'capacity': 35,
                'tags': ['Python', 'Data Science', 'Programming'],
                'status': 'Upcoming',
                'zoom_link': 'https://zoom.us/j/9876543210'
            },
            {
                'title': 'Machine Learning Fundamentals',
                'description': 'Learn the basics of machine learning algorithms and their applications.',
                'date': datetime.now().date() + timedelta(days=20),
                'start_time': '16:00:00',
                'end_time': '17:30:00',
                'location': 'Online - Zoom',
                'capacity': 40,
                'tags': ['Machine Learning', 'AI', 'Data Science'],
                'status': 'Upcoming',
                'zoom_link': 'https://zoom.us/j/1357924680'
            }
        ]
        
        # Create lectures
        lectures_created = 0
        for data in lecture_data:
            # Assign a random expert
            expert = random.choice(experts)
            
            # Create the lecture
            Lecture.objects.create(
                title=data['title'],
                description=data['description'],
                date=data['date'],
                start_time=data['start_time'],
                end_time=data['end_time'],
                location=data['location'],
                capacity=data['capacity'],
                expert=expert,
                tags=data['tags'],
                status=data['status'],
                zoom_link=data['zoom_link']
            )
            lectures_created += 1
        
        self.stdout.write(self.style.SUCCESS(f'Successfully created {lectures_created} test lectures.')) 