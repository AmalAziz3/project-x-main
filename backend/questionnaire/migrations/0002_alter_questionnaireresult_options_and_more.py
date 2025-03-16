# Generated by Django 4.2.7 on 2025-02-28 18:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('questionnaire', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='questionnaireresult',
            options={'ordering': ['-date_taken']},
        ),
        migrations.AlterField(
            model_name='majorweight',
            name='choice',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='major_weights', to='questionnaire.choice'),
        ),
        migrations.AlterField(
            model_name='majorweight',
            name='major',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='choice_weights', to='questionnaire.major'),
        ),
        migrations.AlterField(
            model_name='majorweight',
            name='weight',
            field=models.FloatField(default=0.0),
        ),
        migrations.AlterField(
            model_name='question',
            name='text',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='questionnaireresult',
            name='major',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_results', to='questionnaire.major'),
        ),
        migrations.AlterUniqueTogether(
            name='majorweight',
            unique_together={('choice', 'major')},
        ),
        migrations.AlterUniqueTogether(
            name='userresponse',
            unique_together={('result', 'question')},
        ),
    ]
