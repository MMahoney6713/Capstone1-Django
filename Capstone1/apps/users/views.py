from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_protect, csrf_exempt, ensure_csrf_cookie
from django.http import HttpResponse, JsonResponse
import json

from apps.users.models import User

def landing_page(request):
    if request.user.is_authenticated:
        return redirect('calendars:calendars_view')
    else:
        return render(request, 'users/landing-page.html')


def register_view(request):
    if request.method == 'GET':
        return render(request, 'users/register.html')

    elif request.method == 'POST':
        user_data = json.loads(request.body)
        if User.validate_registration_data(user_data):
            user = User.objects.create_user(full_name=user_data['fullname'], email=user_data['email'], password=user_data['password1'])
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            return redirect('calendars:calendars_view')

@ensure_csrf_cookie
def login_view(request):
    
    if request.method == 'GET':
        return render(request, 'users/login.html')
    elif request.method == 'POST':
        import pdb; pdb.set_trace
        user_data = json.loads(request.body)
        user = authenticate(request, email=user_data['email'], password=user_data['password'])
        if user is not None:
            login(request, user)
            return redirect('calendars:calendars_view')
        else:
            return redirect('users:login_view')


def logout_view(request):
    logout(request)
    return redirect('users:landing_page')