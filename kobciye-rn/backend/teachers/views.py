from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Teacher
from .serializers import TeacherSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    """
    CRUD for Teacher.
    TODO (Phase 3): Filter by request.user.userprofile.school for school isolation.
    """
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Teacher.objects.none()
        profile = user.userprofile
        role = profile.role
        qs = Teacher.objects.select_related('school', 'user_profile')

        if role == 'super_admin':
            return qs.all()
        elif role in ('school_admin', 'accountant', 'parent', 'student'):
            return qs.filter(school=profile.school)
        elif role == 'teacher':
            return qs.filter(user_profile=profile)
        return Teacher.objects.none()
