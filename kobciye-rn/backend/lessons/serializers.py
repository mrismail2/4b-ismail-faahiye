from rest_framework import serializers
from .models import LessonPreparation


class LessonPreparationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonPreparation
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
