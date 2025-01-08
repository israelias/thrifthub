#!/bin/bash

# Navigate to the backend directory
# Get the absolute path of the directory containing this script before appkying the cd command
cd "$(dirname "$(readlink -f "$0")")"

# Activate the virtual environment
source venv/bin/activate

# Run Django development server
python manage.py runserver
