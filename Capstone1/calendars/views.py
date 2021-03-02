from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect


def homepage(request):
    return render(request, 'calendars/homepage.html')


def exampleRedirect(request, question_id):
    return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))