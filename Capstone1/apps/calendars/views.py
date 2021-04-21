from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.contrib.auth.decorators import login_required
from datetime import date
import json

from apps.calendars.models import Milestones, Goals

@login_required
def calendars_view(request):
    return render(request, 'calendars/calendars.html')

@login_required
def milestones(request):
    
    if request.method == "POST":
        milestoneData = json.loads(request.body)
        newMilestone = Milestones.objects.create(
            date=date(int(milestoneData['year']), int(milestoneData['month']), int(milestoneData['day'])), 
            title=milestoneData['title'], 
            goal_id=int(milestoneData['goal_id']) if milestoneData['goal_id'] != '' else None, 
            user_id=request.user.id)
        newMilestone.save()
        return JsonResponse(newMilestone.JSON())

    elif request.method == "GET":
        month = int(request.GET.get('month')) + 1 # Adjust the month value +1 based on differences between datetime objects and front end date objects
        year = int(request.GET.get('year'))        
        monthMilestones = Milestones.objects \
            .filter(user_id=request.user.id) \
            .filter(date__gte=date(year,month,1)) \
            .filter(date__lt=date(year,month+1,1)) \
            .order_by('date')
        monthMilestonesJSON = [{milestone.date.day: milestone.JSON()} for milestone in monthMilestones]
        return JsonResponse(monthMilestonesJSON, safe=False)
