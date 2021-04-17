import datetime

from django.db import models
from django.utils import timezone


class Users(models.Model):
    username = models.CharField(max_length=15, unique=True)
    email = models.EmailField()
    name = models.CharField(max_length=30)
    password = models.CharField(max_length=100)
    # image = models.ImageField()


class Missions(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    # color


class Goals(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    # color


class Milestones(models.Model):
    title = models.CharField(max_length=20)
    goal = models.ForeignKey(Goals, on_delete=models.CASCADE)
    date = models.DateField()

    def JSON(self):
        return {
            'id': self.id,
            'goal_id': self.goal.id,
            'title': self.title,
            'day': self.date.day,
            'month': self.date.month,
            'year': self.date.year
        }

