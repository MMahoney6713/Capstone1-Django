import datetime

from django.db import models
from django.utils import timezone


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)

    def __str__(self):
        return self.question_text


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

    def __str__(self):
        return self.choice_text



class Users(models.Model):
    id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=15, unique=True)
    email = models.EmailField()
    name = models.CharField(max_length=30)
    password = models.CharField(max_length=100)
    # image = models.ImageField()


class Missions(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    # color

class Goals(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    # color

class Milestones(models.Model):
    id = models.IntegerField(primary_key=True)
    goal = models.ForeignKey(Goals, on_delete=models.CASCADE)
    date = models.DateField()

