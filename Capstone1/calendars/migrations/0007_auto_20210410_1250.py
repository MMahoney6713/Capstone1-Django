# Generated by Django 3.1.7 on 2021-04-10 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('calendars', '0006_milestones_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='milestones',
            name='id',
            field=models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
