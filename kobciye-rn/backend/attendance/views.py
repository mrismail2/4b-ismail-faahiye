from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Attendance.objects.none()
        profile = user.userprofile
        role = profile.role
        qs = Attendance.objects.select_related('school', 'student', 'classroom', 'recorded_by')

        if role == 'super_admin':
            return qs.all()
        elif role in ('school_admin', 'accountant'):
            return qs.filter(school=profile.school)
        elif role == 'teacher':
            return qs.filter(school=profile.school)
        elif role == 'student':
            return qs.filter(student__user_profile=profile)
        elif role == 'parent':
            from parents.models import ParentStudent
            linked = ParentStudent.objects.filter(
                parent__user_profile=profile
            ).values_list('student_id', flat=True)
            return qs.filter(student__in=linked)
        return Attendance.objects.none()
