from rest_framework import serializers
from .models import Parent, ParentStudent


class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class ParentStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentStudent
        fields = '__all__'
        read_only_fields = ('created_at',)
