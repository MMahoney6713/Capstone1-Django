from django.urls import path
from . import views

app_name = 'calendars'

urlpatterns = [
    path('', views.calendars_view, name='calendars_view'),
    path('milestones', views.milestones, name='milestones'),
    path('missions/', views.missions, name='missions'),
    path('missions/<int:mission_id>', views.missions, name='missions'),
    path('goals/', views.goals, name='goals'),
    path('goals/<int:goal_id>', views.goals, name='goals'),
]