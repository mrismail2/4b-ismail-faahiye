from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Teacher
from .serializers import TeacherSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Teacher.objects.none()
        profile = user.userprofile
        qs = Teacher.objects.select_related('school', 'user_profile')
        if profile.role == 'super_admin':
            return qs.all()
        if profile.role == 'teacher':
            return qs.filter(user_profile=profile)
        if profile.school:
            return qs.filter(school=profile.school)
        return Teacher.objects.none()
