from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.contrib.auth.decorators import login_required
from datetime import date
import json

from apps.calendars.models import Milestones, Goals, Missions

@login_required
def calendars_view(request):
    return render(request, 'calendars/calendars.html')

@login_required
def milestones(request):
    
    if request.method == "POST":
        milestone_data = json.loads(request.body)
        new_milestone = Milestones.objects.create(
            date=date(int(milestone_data['year']), int(milestone_data['month']), int(milestone_data['day'])), 
            title=milestone_data['title'], 
            goal_id=int(milestone_data['goal_id']) if milestone_data['goal_id'] != '' else None, 
            user_id=request.user.id)
        new_milestone.save()
        return JsonResponse(new_milestone.JSON())

    elif request.method == "GET":
        month = int(request.GET.get('month')) + 1 # Adjust the month value +1 based on differences between datetime objects and front end date objects
        year = int(request.GET.get('year'))        
        month_milestones = Milestones.objects \
            .filter(user_id=request.user.id) \
            .filter(date__gte=date(year,month,1)) \
            .filter(date__lt=date(year,month+1,1)) \
            .order_by('date')
        month_milestones_JSON = [{milestone.date.day: milestone.JSON()} for milestone in month_milestones]
        return JsonResponse(month_milestones_JSON, safe=False)

@login_required
def missions(request):
    import pdb; pdb.set_trace()
    if request.method == "GET":
        user_missions = Missions.objects.filter(user_id = request.user.id).get()
        
        return JsonResponse({'foo':'bar'}, safe=False)
    elif request.method == "POST":
        return JsonResponse({'foo':'bar'}, safe=False)