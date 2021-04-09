from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect, csrf_exempt
import json

from calendars.models import Milestones


def homepage(request):
    return render(request, 'calendars/homepage.html')


def exampleRedirect(request, question_id):
    return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))

@csrf_exempt
def milestones(request):
    # import pdb; pdb.set_trace()
    milestoneData = json.loads(request.body)
    milestone1 = Milestones.objects.first()

    return JsonResponse(milestone1.JSON())