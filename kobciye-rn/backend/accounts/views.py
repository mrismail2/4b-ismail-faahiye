from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import UserProfile, Permission, RolePermission
from .serializers import UserProfileSerializer, PermissionSerializer, RolePermissionSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return UserProfile.objects.none()
        profile = user.userprofile
        role = profile.role

        if role == 'super_admin':
            return UserProfile.objects.select_related('user', 'school').all()
        return UserProfile.objects.select_related('user', 'school').filter(school=profile.school)


class PermissionViewSet(viewsets.ModelViewSet):
    serializer_class = PermissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Permission.objects.none()
        if user.userprofile.role == 'super_admin':
            return Permission.objects.all()
        return Permission.objects.none()


class RolePermissionViewSet(viewsets.ModelViewSet):
    serializer_class = RolePermissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return RolePermission.objects.none()
        if user.userprofile.role == 'super_admin':
            return RolePermission.objects.select_related('permission').all()
        return RolePermission.objects.none()
