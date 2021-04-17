from django.urls import path
from . import views

app_name = 'calendars'

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('milestones', views.milestones, name='milestones'),
]