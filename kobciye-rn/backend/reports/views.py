from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import ParentReport
from .serializers import ParentReportSerializer


class ParentReportViewSet(viewsets.ModelViewSet):
    serializer_class = ParentReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return ParentReport.objects.none()
        profile = user.userprofile
        qs = ParentReport.objects.select_related('school', 'student', 'generated_by')
        if profile.role == 'super_admin':
            return qs.all()
        if profile.role in ('school_admin', 'teacher') and profile.school:
            return qs.filter(school=profile.school)
        if profile.role == 'parent':
            from parents.models import ParentStudent
            linked = ParentStudent.objects.filter(
                parent__user_profile=profile
            ).values_list('student_id', flat=True)
            return qs.filter(student_id__in=linked, is_sent=True)
        if profile.role == 'student':
            return qs.filter(student__user_profile=profile, is_sent=True)
        return ParentReport.objects.none()
