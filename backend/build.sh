#!/usr/bin/env bash
# exit on error
# set -o errexit
echo "installing"
pip install -r requirements.txt
echo "collecting static"
python manage.py collectstatic --no-input
echo "migrating"
python manage.py migrate