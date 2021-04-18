from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_protect, csrf_exempt
# from django.contrib.auth.decorators import login_required
import json

from apps.users.models import User

@csrf_exempt
def register_view(request):
    if request.method == 'GET':
        return render(request, 'users/register.html')

    elif request.method == 'POST':
        user_data = json.loads(request.body)
        if User.validate_registration_data(user_data):
            user = User.objects.create_user(full_name=user_data['fullname'], email=user_data['email'], password=user_data['password1'])
        return redirect('users:login_view')

@csrf_exempt
def login_view(request):
    if request.method == 'GET':
        return render(request, 'users/login.html')
    elif request.method == 'POST':
        user_data = json.loads(request.body)
        user = authenticate(request, email=user_data['email'], password=user_data['password'])
        if user is not None:
            login(request, user)
            # Redirect to a success page.
            return redirect('calendars:homepage')
        else:
            # Return an 'invalid login' error message.
            return redirect('users:login_view')

@csrf_exempt
def logout_view(request):
    logout(request)
    # Redirect to a success page.
    return redirect('users:login_view')