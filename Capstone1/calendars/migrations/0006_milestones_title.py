# Generated by Django 3.1.7 on 2021-04-10 16:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendars', '0005_auto_20210409_1624'),
    ]

    operations = [
        migrations.AddField(
            model_name='milestones',
            name='title',
            field=models.CharField(default='title', max_length=20),
            preserve_default=False,
        ),
    ]