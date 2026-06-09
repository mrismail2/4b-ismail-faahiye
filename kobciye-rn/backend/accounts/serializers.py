from rest_framework import serializers
from .models import UserProfile, Permission, RolePermission


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class RolePermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RolePermission
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
