from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout


def register_view(request):
    return 


def login_view(request):
    if request.method == 'GET':
        return render(request, 'users/login.html')
    elif request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Redirect to a success page.
            ...
        else:
            # Return an 'invalid login' error message.
            ...
    return

def logout_view(request):
    logout(request)
    # Redirect to a success page.
    return