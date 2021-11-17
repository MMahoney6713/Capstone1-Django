from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect, csrf_exempt, ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from datetime import date
import json

from apps.calendars.models import Milestones, Goals, Missions

@login_required
@ensure_csrf_cookie
def calendars_view(request):
    return render(request, 'calendars/calendars.html')

@login_required
def milestones(request):
    
    if request.method == "POST":
        milestone_data = json.loads(request.body)
        new_milestone = Milestones.objects.create(
            date = date(int(milestone_data['year']), int(milestone_data['month']), int(milestone_data['day'])), 
            title = milestone_data['title'], 
            goal_id = int(milestone_data['goal_id']) if milestone_data['goal_id'] != '' else None, 
            user_id = request.user.id)
        new_milestone.save()
        return JsonResponse(new_milestone.JSON())

    elif request.method == "GET":
        month = int(request.GET.get('month')) + 1 # Adjust the month value +1 based on differences between datetime objects and front end date objects
        year = int(request.GET.get('year'))
        
        next_month = month + 1
        next_year = year
        if next_month > 12:
            next_year += 1
            next_month = next_month%12
        
        month_milestones = Milestones.objects \
            .filter(user_id = request.user.id) \
            .filter(date__gte = date(year,month,1)) \
            .filter(date__lt = date(next_year,next_month,1)) \
            .order_by('date')
        month_milestones_JSON = [{milestone.date.day: milestone.JSON()} for milestone in month_milestones]
        return JsonResponse(month_milestones_JSON, safe=False)

    elif request.method == "PUT":
        
        milestone_data = json.loads(request.body)
        updated_milestone = Milestones.objects.get(id=milestone_data['id'])
        
        updated_milestone.date = date(int(milestone_data['year']), int(milestone_data['month']), int(milestone_data['day']))
        updated_milestone.title = milestone_data['title']
        updated_milestone.goal_id = int(milestone_data['goal_id']) if milestone_data['goal_id'] != '' else None
        
        updated_milestone.save(update_fields=['date', 'title', 'goal_id'])
        return JsonResponse(updated_milestone.JSON())

    elif request.method == "DELETE":
        milestone_data = json.loads(request.body)
        milestone_to_delete = Milestones.objects.get(id=milestone_data['milestone_id'])
        milestone_to_delete.delete()
        return JsonResponse({'foo':'bar'}, safe=False)

@login_required
def missions(request, mission_id = ''):

    if request.method == "GET":
        if mission_id:
            user_missions = Missions.objects.filter(id = mission_id)
        else:
            user_missions = Missions.objects.filter(user_id = request.user.id).all()
        
        user_missions_JSON = [mission.JSON() for mission in user_missions]
        return JsonResponse(user_missions_JSON, safe=False)

    elif request.method == "POST":
        mission_data = json.loads(request.body)
        new_mission = Missions.objects.create(
            user = request.user,
            title = mission_data['title'],
            description = mission_data['description']
        )
        new_mission.save()
        return JsonResponse(new_mission.JSON())

    elif request.method == "PUT":
        mission_data = json.loads(request.body)
        updated_mission = Missions.objects.get(id=mission_data['id'])

        updated_mission.title = mission_data['title']
        updated_mission.description = mission_data['description']

        updated_mission.save(update_fields=['title', 'description'])
        return JsonResponse(updated_mission.JSON())

    elif request.method == "DELETE":
        mission_data = json.loads(request.body)
        mission_to_delete = Missions.objects.get(id=mission_data['mission_id'])
        mission_to_delete.delete()
        return JsonResponse({'foo':'bar'}, safe=False)
    
@login_required
def goals(request, goal_id = ''):

    if request.method == "GET":
        if goal_id:
            user_goals = Goals.objects.filter(id = goal_id)
        else:
            user_goals = Goals.objects.filter(user_id = request.user.id).all()
        
        user_goals_JSON = [goal.JSON() for goal in user_goals]
        return JsonResponse(user_goals_JSON, safe=False)

    elif request.method == "POST":
        goal_data = json.loads(request.body)
        new_goal = Goals.objects.create(
            user = request.user,
            title = goal_data['title'],
            description = goal_data['description'] if goal_data['description'] != '' else "No Description"
        )
        new_goal.save()
        return JsonResponse(new_goal.JSON())

    elif request.method == "PUT":
        goal_data = json.loads(request.body)
        updated_goal = Goals.objects.get(id=goal_data['id'])

        updated_goal.title = goal_data['title']
        updated_goal.description = goal_data['description']

        updated_goal.save(update_fields=['title', 'description'])
        return JsonResponse(updated_goal.JSON())

    elif request.method == "DELETE":
        goal_data = json.loads(request.body)
        goal_to_delete = Goals.objects.get(id=goal_data['goal_id'])
        goal_to_delete.delete()
        return JsonResponse({'foo':'bar'}, safe=False)