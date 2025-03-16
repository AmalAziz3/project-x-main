from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LectureViewSet, LectureRegistrationViewSet

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'', LectureViewSet, basename='lecture')
router.register(r'registrations', LectureRegistrationViewSet, basename='lecture-registration')

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
] 