#!/bin/bash

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Create default users
echo "Creating default users..."
python manage.py create_default_users

# Verify default users
echo "Verifying default users..."
python manage.py verify_default_users

# Fix user roles
echo "Fixing user roles..."
python manage.py fix_user_roles

# Populate questionnaire
echo "Populating questionnaire..."
python manage.py populate_questionnaire_always

# Start server
echo "Starting server..."
python manage.py runserver 0.0.0.0:8000 