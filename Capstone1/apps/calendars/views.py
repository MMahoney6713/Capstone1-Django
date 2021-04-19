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

@csrf_exempt
@login_required
def milestones(request):
    
    if request.method == "POST":
        milestoneData = json.loads(request.body)
        newMilestone = Milestones.objects.create(date=date(int(milestoneData['year']), int(milestoneData['month']), int(milestoneData['day'])), title=milestoneData['title'], goal_id=milestoneData['goal_id'])
        newMilestone.save()
        return JsonResponse(newMilestone.JSON())

    elif request.method == "GET":
        month = int(request.GET.get('month'))+1 # Adjust the month value +1 based on differences between datetime objects and front end date objects
        year = int(request.GET.get('year'))        
        monthMilestones = Milestones.objects.filter(date__gte=date(year,month,1)).filter(date__lt=date(year,month+1,1)).order_by('date')
        monthMilestonesJSON = [{milestone.date.day: milestone.JSON()} for milestone in monthMilestones]
        # import pdb; pdb.set_trace()
        return JsonResponse(monthMilestonesJSON, safe=False)

    
# @login_required(redirect_field_name='my_redirect_field')