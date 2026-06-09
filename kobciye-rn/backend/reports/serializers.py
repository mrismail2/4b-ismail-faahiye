from rest_framework import serializers
from .models import ParentReport


class ParentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParentReport
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
