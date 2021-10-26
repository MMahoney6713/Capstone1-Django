from django.urls import path, include
from . import views
# from django.contrib.auth import views as auth_views

app_name = 'users'

urlpatterns = [
    path('login', views.login_view, name='login_view'),
    path('register', views.register_view, name='register_view'),
    path('logout', views.logout_view, name='logout_view'),
    path('', views.landing_page, name='landing_page'),
]