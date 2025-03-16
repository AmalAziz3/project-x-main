from django.core.management.base import BaseCommand
from questionnaire.models import Major, Question, Choice, MajorWeight
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Populates the database with a high school student-focused questionnaire to help identify potential college majors'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting high school major questionnaire data population...'))
        
        # Define the questions data
        questions_data = self.get_questions_data()
        
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
                defaults={'description': self.get_major_description(major_name)}
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
                    weight = choice_data['weight']
                    
                    major_weight, created = MajorWeight.objects.get_or_create(
                        choice=choice,
                        major=major,
                        defaults={'weight': weight}
                    )
                    
                    if not created:
                        # Update weight if it's different
                        if major_weight.weight != weight:
                            major_weight.weight = weight
                            major_weight.save()
                            self.stdout.write(self.style.SUCCESS(f'Updated weight for {major.name} -> {choice.text}: {weight}'))
                    else:
                        self.stdout.write(self.style.SUCCESS(f'Created weight for {major.name} -> {choice.text}: {weight}'))
        
        self.stdout.write(self.style.SUCCESS('Questionnaire data population completed!'))
    
    def get_major_description(self, major_name):
        """Get detailed descriptions for each major."""
        descriptions = {
            "Computer Science": "Computer Science involves the study of computation, algorithms, programming languages, and software systems. Students learn to solve problems using programming, data structures, and computational thinking.",
            
            "Engineering": "Engineering applies scientific and mathematical principles to design and build systems, structures, and machines. It includes various specialties like mechanical, electrical, civil, and chemical engineering.",
            
            "Business": "Business studies encompass management, marketing, finance, and entrepreneurship. Students learn to operate organizations, make business decisions, and understand market dynamics.",
            
            "Mathematics": "Mathematics focuses on the study of quantity, structure, space, and change. It develops logical reasoning, problem-solving, and analytical skills applicable across many fields.",
            
            "Biology": "Biology explores living organisms, their functions, structures, growth, and interactions with each other and the environment. It ranges from molecular biology to ecosystem studies.",
            
            "Psychology": "Psychology is the scientific study of the mind and behavior. Students learn about cognitive processes, human development, social interactions, and mental health.",
            
            "Chemistry": "Chemistry examines matter, its properties, composition, and the changes it undergoes. It connects the physical sciences with life sciences and applied sciences like medicine.",
            
            "Physics": "Physics explores matter, energy, force, and motion. It seeks to understand the fundamental principles governing the universe, from subatomic particles to cosmic structures.",
            
            "Communications": "Communications studies focus on how information is transmitted and received. Students learn about media, public relations, journalism, and effective communication strategies.",
            
            "Education": "Education studies prepare students to become teachers and educators. Coursework includes learning theories, curriculum design, teaching methods, and educational psychology.",
            
            "Art & Design": "Art & Design programs develop creative expression, visual communication, and aesthetic skills. Areas include fine arts, graphic design, animation, and digital media.",
            
            "Medicine & Health Sciences": "Medicine & Health Sciences prepare students for careers in healthcare. Topics include human anatomy, physiology, disease prevention, and healthcare systems.",
            
            "Environmental Science": "Environmental Science examines the environment and how humans interact with it. It covers ecology, conservation, climate science, and sustainable development.",
            
            "Social Sciences": "Social Sciences study human society and social relationships. Fields include sociology, anthropology, political science, and economics.",
            
            "Literature & Languages": "Literature & Languages explore written works, linguistic structures, and cultural expressions. Students develop critical thinking, communication, and cultural understanding.",
            
            "Performing Arts": "Performing Arts focus on creative expression through music, theater, dance, and film. Programs develop performance skills, creativity, and artistic expression.",
            
            "Architecture": "Architecture combines art, science, and technology to design buildings and structures. Students learn about design principles, construction methods, and spatial planning.",
            
            "History": "History examines past events, societies, and cultures. Students develop research skills, critical thinking, and an understanding of how the past shapes the present.",
            
            "Political Science": "Political Science studies governance, political behavior, and systems of government. Topics include political theory, international relations, and public policy.",
            
            "Philosophy": "Philosophy explores fundamental questions about existence, knowledge, values, reason, and language. It develops critical thinking, logical reasoning, and ethical analysis.",
            
            "Economics": "Economics studies how individuals, businesses, and societies allocate resources. It examines markets, economic systems, and decision-making processes.",
            
            "Data Science": "Data Science combines statistics, mathematics, and computer science to extract knowledge from data. Students learn analytics, machine learning, and data visualization.",
            
            "Journalism": "Journalism focuses on gathering, assessing, and presenting news and information. Students develop research, writing, and media production skills.",
            
            "Agriculture": "Agriculture studies crop production, livestock management, and food systems. It includes topics like soil science, animal husbandry, and agricultural economics.",
            
            "Law": "Law studies legal systems, principles, and practices. Students learn about constitutional law, criminal law, civil law, and legal research and writing.",
            
            "Music": "Music programs develop performance, composition, and music theory skills. Students may specialize in instrumental performance, vocal performance, or music production.",
            
            "Neuroscience": "Neuroscience explores the structure and function of the nervous system. It combines biology, psychology, and other sciences to understand the brain and behavior.",
            
            "Anthropology": "Anthropology examines human diversity, culture, and evolution. It includes cultural anthropology, archaeology, linguistics, and biological anthropology.",
            
            "Foreign Languages": "Foreign Language studies develop proficiency in languages other than one's native tongue. Programs include language skills, literature, and cultural understanding.",
            
            "Nursing": "Nursing prepares students to provide healthcare to individuals, families, and communities. Coursework includes anatomy, pharmacology, and patient care."
        }
        
        return descriptions.get(major_name, f"A degree in {major_name} prepares students for careers in various fields related to {major_name.lower()}.")
    
    def get_questions_data(self):
        """Define the questions, choices, and their associated majors with weights."""
        return [
            {
                "id": 1,
                "text": "Which school subjects do you enjoy the most?",
                "choices": [
                    {
                        "text": "Math and problem-solving",
                        "majors": ["Mathematics", "Computer Science", "Engineering", "Physics", "Economics", "Data Science"],
                        "weight": 10
                    },
                    {
                        "text": "Science and experiments",
                        "majors": ["Biology", "Chemistry", "Physics", "Environmental Science", "Medicine & Health Sciences", "Neuroscience"],
                        "weight": 10
                    },
                    {
                        "text": "Writing and literature",
                        "majors": ["Literature & Languages", "Journalism", "Communications", "History", "Philosophy", "Law"],
                        "weight": 10
                    },
                    {
                        "text": "Art, music, or creative expression",
                        "majors": ["Art & Design", "Performing Arts", "Music", "Architecture", "Communications", "Literature & Languages"],
                        "weight": 10
                    },
                    {
                        "text": "Social studies and understanding people",
                        "majors": ["Psychology", "Social Sciences", "History", "Political Science", "Anthropology", "Education"],
                        "weight": 10
                    }
                ]
            },
            {
                "id": 2,
                "text": "How do you prefer to solve problems?",
                "choices": [
                    {
                        "text": "Logically analyzing information and finding patterns",
                        "majors": ["Computer Science", "Mathematics", "Physics", "Engineering", "Data Science", "Economics"],
                        "weight": 9
                    },
                    {
                        "text": "Coming up with creative or innovative solutions",
                        "majors": ["Art & Design", "Architecture", "Engineering", "Business", "Communications", "Performing Arts"],
                        "weight": 9
                    },
                    {
                        "text": "Researching thoroughly and testing different approaches",
                        "majors": ["Biology", "Chemistry", "Environmental Science", "Psychology", "History", "Social Sciences"],
                        "weight": 9
                    },
                    {
                        "text": "Discussing with others and finding collaborative solutions",
                        "majors": ["Communications", "Business", "Education", "Psychology", "Political Science", "Social Sciences"],
                        "weight": 9
                    },
                    {
                        "text": "Applying practical, hands-on approaches",
                        "majors": ["Engineering", "Medicine & Health Sciences", "Agriculture", "Nursing", "Art & Design", "Performing Arts"],
                        "weight": 9
                    }
                ]
            },
            {
                "id": 3,
                "text": "What kind of activities do you enjoy doing in your free time?",
                "choices": [
                    {
                        "text": "Building, fixing, or programming things",
                        "majors": ["Engineering", "Computer Science", "Architecture", "Physics", "Art & Design", "Data Science"],
                        "weight": 8
                    },
                    {
                        "text": "Reading, writing, or engaging with media",
                        "majors": ["Literature & Languages", "Journalism", "Communications", "Philosophy", "History", "Political Science"],
                        "weight": 8
                    },
                    {
                        "text": "Helping or teaching others",
                        "majors": ["Education", "Psychology", "Nursing", "Medicine & Health Sciences", "Social Sciences", "Communications"],
                        "weight": 8
                    },
                    {
                        "text": "Exploring nature or conducting experiments",
                        "majors": ["Biology", "Environmental Science", "Chemistry", "Agriculture", "Physics", "Anthropology"],
                        "weight": 8
                    },
                    {
                        "text": "Creating art, music, or performing",
                        "majors": ["Art & Design", "Music", "Performing Arts", "Communications", "Architecture", "Literature & Languages"],
                        "weight": 8
                    }
                ]
            },
            {
                "id": 4,
                "text": "Which of these careers sounds most appealing to you?",
                "choices": [
                    {
                        "text": "Scientist, researcher, or analyst",
                        "majors": ["Biology", "Chemistry", "Physics", "Environmental Science", "Data Science", "Psychology"],
                        "weight": 10
                    },
                    {
                        "text": "Engineer, architect, or developer",
                        "majors": ["Engineering", "Computer Science", "Architecture", "Mathematics", "Data Science", "Physics"],
                        "weight": 10
                    },
                    {
                        "text": "Business leader, entrepreneur, or manager",
                        "majors": ["Business", "Economics", "Communications", "Political Science", "Law", "Data Science"],
                        "weight": 10
                    },
                    {
                        "text": "Healthcare provider, counselor, or caregiver",
                        "majors": ["Medicine & Health Sciences", "Nursing", "Psychology", "Biology", "Social Sciences", "Education"],
                        "weight": 10
                    },
                    {
                        "text": "Artist, writer, designer, or performer",
                        "majors": ["Art & Design", "Literature & Languages", "Performing Arts", "Music", "Communications", "Architecture"],
                        "weight": 10
                    }
                ]
            },
            {
                "id": 5,
                "text": "What impact would you like to make in the world?",
                "choices": [
                    {
                        "text": "Advance technology and innovation",
                        "majors": ["Computer Science", "Engineering", "Physics", "Data Science", "Mathematics", "Architecture"],
                        "weight": 9
                    },
                    {
                        "text": "Improve health and well-being",
                        "majors": ["Medicine & Health Sciences", "Nursing", "Psychology", "Biology", "Chemistry", "Neuroscience"],
                        "weight": 9
                    },
                    {
                        "text": "Promote social justice and equality",
                        "majors": ["Political Science", "Law", "Social Sciences", "Education", "Philosophy", "Anthropology"],
                        "weight": 9
                    },
                    {
                        "text": "Create art, culture, or entertainment",
                        "majors": ["Art & Design", "Music", "Performing Arts", "Literature & Languages", "Communications", "Journalism"],
                        "weight": 9
                    },
                    {
                        "text": "Protect the environment and natural resources",
                        "majors": ["Environmental Science", "Biology", "Agriculture", "Chemistry", "Political Science", "Engineering"],
                        "weight": 9
                    }
                ]
            },
            {
                "id": 6,
                "text": "How do you prefer to learn new things?",
                "choices": [
                    {
                        "text": "Through hands-on experiences and practice",
                        "majors": ["Engineering", "Art & Design", "Medicine & Health Sciences", "Nursing", "Agriculture", "Performing Arts"],
                        "weight": 7
                    },
                    {
                        "text": "By analyzing data and finding patterns",
                        "majors": ["Mathematics", "Data Science", "Physics", "Computer Science", "Economics", "Chemistry"],
                        "weight": 7
                    },
                    {
                        "text": "Through reading and independent study",
                        "majors": ["Literature & Languages", "Philosophy", "History", "Political Science", "Law", "Social Sciences"],
                        "weight": 7
                    },
                    {
                        "text": "By discussing ideas with others",
                        "majors": ["Communications", "Education", "Business", "Psychology", "Political Science", "Philosophy"],
                        "weight": 7
                    },
                    {
                        "text": "Through observation and experimentation",
                        "majors": ["Biology", "Chemistry", "Physics", "Environmental Science", "Psychology", "Anthropology"],
                        "weight": 7
                    }
                ]
            },
            {
                "id": 7,
                "text": "Which of these workplace environments appeals to you most?",
                "choices": [
                    {
                        "text": "Technology company or research lab",
                        "majors": ["Computer Science", "Engineering", "Data Science", "Biology", "Chemistry", "Physics"],
                        "weight": 8
                    },
                    {
                        "text": "Hospital, clinic, or healthcare facility",
                        "majors": ["Medicine & Health Sciences", "Nursing", "Psychology", "Biology", "Neuroscience", "Social Sciences"],
                        "weight": 8
                    },
                    {
                        "text": "School, university, or educational setting",
                        "majors": ["Education", "Psychology", "Mathematics", "Literature & Languages", "History", "Foreign Languages"],
                        "weight": 8
                    },
                    {
                        "text": "Creative studio, media company, or theater",
                        "majors": ["Art & Design", "Communications", "Performing Arts", "Music", "Journalism", "Literature & Languages"],
                        "weight": 8
                    },
                    {
                        "text": "Business office, startup, or corporation",
                        "majors": ["Business", "Economics", "Communications", "Computer Science", "Law", "Political Science"],
                        "weight": 8
                    }
                ]
            },
            {
                "id": 8,
                "text": "Which skills would you most like to develop?",
                "choices": [
                    {
                        "text": "Technical and analytical skills",
                        "majors": ["Computer Science", "Engineering", "Mathematics", "Data Science", "Physics", "Economics"],
                        "weight": 9
                    },
                    {
                        "text": "Creative and artistic abilities",
                        "majors": ["Art & Design", "Music", "Performing Arts", "Architecture", "Literature & Languages", "Communications"],
                        "weight": 9
                    },
                    {
                        "text": "Communication and interpersonal skills",
                        "majors": ["Communications", "Business", "Education", "Psychology", "Political Science", "Journalism"],
                        "weight": 9
                    },
                    {
                        "text": "Research and analytical thinking",
                        "majors": ["Biology", "Chemistry", "Physics", "Psychology", "History", "Social Sciences"],
                        "weight": 9
                    },
                    {
                        "text": "Leadership and organizational abilities",
                        "majors": ["Business", "Political Science", "Education", "Communications", "Law", "Social Sciences"],
                        "weight": 9
                    }
                ]
            },
            {
                "id": 9,
                "text": "What topics do you find yourself most curious about?",
                "choices": [
                    {
                        "text": "How technology and machines work",
                        "majors": ["Computer Science", "Engineering", "Physics", "Data Science", "Mathematics", "Architecture"],
                        "weight": 8
                    },
                    {
                        "text": "How living things function and evolve",
                        "majors": ["Biology", "Medicine & Health Sciences", "Environmental Science", "Psychology", "Neuroscience", "Agriculture"],
                        "weight": 8
                    },
                    {
                        "text": "How societies and cultures develop",
                        "majors": ["History", "Anthropology", "Social Sciences", "Political Science", "Philosophy", "Literature & Languages"],
                        "weight": 8
                    },
                    {
                        "text": "How markets and economies function",
                        "majors": ["Economics", "Business", "Political Science", "Mathematics", "Data Science", "Agriculture"],
                        "weight": 8
                    },
                    {
                        "text": "How people think and behave",
                        "majors": ["Psychology", "Neuroscience", "Social Sciences", "Philosophy", "Education", "Communications"],
                        "weight": 8
                    }
                ]
            },
            {
                "id": 10,
                "text": "Which high school project would you most enjoy?",
                "choices": [
                    {
                        "text": "Building a robot or coding an app",
                        "majors": ["Computer Science", "Engineering", "Physics", "Data Science", "Mathematics", "Architecture"],
                        "weight": 8
                    },
                    {
                        "text": "Conducting a scientific experiment",
                        "majors": ["Biology", "Chemistry", "Physics", "Environmental Science", "Psychology", "Agriculture"],
                        "weight": 8
                    },
                    {
                        "text": "Creating a work of art, music, or writing",
                        "majors": ["Art & Design", "Music", "Performing Arts", "Literature & Languages", "Communications", "Architecture"],
                        "weight": 8
                    },
                    {
                        "text": "Organizing a community service event",
                        "majors": ["Social Sciences", "Education", "Communications", "Political Science", "Business", "Psychology"],
                        "weight": 8
                    },
                    {
                        "text": "Researching and debating a current issue",
                        "majors": ["Political Science", "Law", "History", "Philosophy", "Journalism", "Communications"],
                        "weight": 8
                    }
                ]
            },
            {
                "id": 11,
                "text": "How important is it for your future career to be well-paying?",
                "choices": [
                    {
                        "text": "Very important - I want a high-earning career",
                        "majors": ["Medicine & Health Sciences", "Computer Science", "Engineering", "Business", "Law", "Data Science"],
                        "weight": 7
                    },
                    {
                        "text": "Somewhat important - balance of pay and passion",
                        "majors": ["Business", "Engineering", "Computer Science", "Communications", "Economics", "Mathematics"],
                        "weight": 7
                    },
                    {
                        "text": "Less important - I prioritize doing work I love",
                        "majors": ["Art & Design", "Education", "Psychology", "Social Sciences", "Literature & Languages", "Performing Arts"],
                        "weight": 7
                    },
                    {
                        "text": "Not important - I'm focused on making a difference",
                        "majors": ["Social Sciences", "Education", "Environmental Science", "Philosophy", "Political Science", "Psychology"],
                        "weight": 7
                    }
                ]
            },
            {
                "id": 12,
                "text": "How comfortable are you with public speaking and presentations?",
                "choices": [
                    {
                        "text": "Very comfortable - I enjoy presenting to groups",
                        "majors": ["Communications", "Business", "Education", "Political Science", "Performing Arts", "Law"],
                        "weight": 6
                    },
                    {
                        "text": "Somewhat comfortable - I can do it when needed",
                        "majors": ["Business", "Education", "Communications", "Psychology", "History", "Journalism"],
                        "weight": 6
                    },
                    {
                        "text": "Prefer to work behind the scenes",
                        "majors": ["Computer Science", "Mathematics", "Engineering", "Chemistry", "Art & Design", "Data Science"],
                        "weight": 6
                    },
                    {
                        "text": "Prefer small group discussions or one-on-one interactions",
                        "majors": ["Psychology", "Social Sciences", "Education", "Medicine & Health Sciences", "Nursing", "Philosophy"],
                        "weight": 6
                    }
                ]
            },
            {
                "id": 13,
                "text": "What aspect of a college major is most important to you?",
                "choices": [
                    {
                        "text": "Career opportunities and job prospects",
                        "majors": ["Computer Science", "Business", "Engineering", "Medicine & Health Sciences", "Data Science", "Nursing"],
                        "weight": 7
                    },
                    {
                        "text": "Following my passion and interests",
                        "majors": ["Art & Design", "Music", "Literature & Languages", "History", "Philosophy", "Performing Arts"],
                        "weight": 7
                    },
                    {
                        "text": "Making a positive impact in society",
                        "majors": ["Medicine & Health Sciences", "Education", "Environmental Science", "Social Sciences", "Political Science", "Psychology"],
                        "weight": 7
                    },
                    {
                        "text": "Intellectual challenge and personal growth",
                        "majors": ["Mathematics", "Physics", "Philosophy", "Law", "Engineering", "Neuroscience"],
                        "weight": 7
                    },
                    {
                        "text": "Practical skills and hands-on learning",
                        "majors": ["Engineering", "Nursing", "Art & Design", "Agriculture", "Computer Science", "Architecture"],
                        "weight": 7
                    }
                ]
            },
            {
                "id": 14,
                "text": "Do you prefer structured environments or flexibility?",
                "choices": [
                    {
                        "text": "Highly structured with clear expectations",
                        "majors": ["Engineering", "Medicine & Health Sciences", "Law", "Mathematics", "Chemistry", "Nursing"],
                        "weight": 6
                    },
                    {
                        "text": "Balanced approach with some guidelines",
                        "majors": ["Business", "Computer Science", "Education", "Biology", "Psychology", "Communications"],
                        "weight": 6
                    },
                    {
                        "text": "Flexible and open-ended environments",
                        "majors": ["Art & Design", "Literature & Languages", "Philosophy", "Music", "Performing Arts", "Communications"],
                        "weight": 6
                    },
                    {
                        "text": "Depends on the specific task or project",
                        "majors": ["Computer Science", "Business", "Communications", "Social Sciences", "Data Science", "Psychology"],
                        "weight": 6
                    }
                ]
            },
            {
                "id": 15,
                "text": "How do you feel about working with numbers and data?",
                "choices": [
                    {
                        "text": "Love it - I enjoy mathematical thinking",
                        "majors": ["Mathematics", "Physics", "Computer Science", "Engineering", "Data Science", "Economics"],
                        "weight": 9
                    },
                    {
                        "text": "It's fine for some purposes",
                        "majors": ["Business", "Psychology", "Biology", "Chemistry", "Environmental Science", "Political Science"],
                        "weight": 9
                    },
                    {
                        "text": "Prefer to work with words and ideas",
                        "majors": ["Literature & Languages", "History", "Philosophy", "Communications", "Journalism", "Political Science"],
                        "weight": 9
                    },
                    {
                        "text": "Prefer to work with people directly",
                        "majors": ["Education", "Psychology", "Nursing", "Communications", "Business", "Social Sciences"],
                        "weight": 9
                    },
                    {
                        "text": "Prefer to work with visual or physical elements",
                        "majors": ["Art & Design", "Architecture", "Performing Arts", "Engineering", "Medicine & Health Sciences", "Agriculture"],
                        "weight": 9
                    }
                ]
            }
        ] 