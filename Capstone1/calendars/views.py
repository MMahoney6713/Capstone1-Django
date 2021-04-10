from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from datetime import date
import json

from calendars.models import Milestones, Goals


def homepage(request):
    return render(request, 'calendars/homepage.html')


def exampleRedirect(request, question_id):
    return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))

@csrf_exempt
def milestones(request):
    
    milestoneData = json.loads(request.body)
    newMilestone = Milestones.objects.create(date=date(int(milestoneData['year']), int(milestoneData['month']), int(milestoneData['day'])), title=milestoneData['title'], goal_id=milestoneData['goal_id'])
    newMilestone.save()

    # import pdb; pdb.set_trace()

    return JsonResponse(newMilestone.JSON())