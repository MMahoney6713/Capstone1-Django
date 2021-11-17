web: gunicorn purposeProject.wsgi:application --log-file -
heroku ps:scale web=1
python Capstone1/manage.py migrate
