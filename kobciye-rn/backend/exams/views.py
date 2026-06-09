from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Exam, ExamResult
from .serializers import ExamSerializer, ExamResultSerializer


class ExamViewSet(viewsets.ModelViewSet):
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Exam.objects.none()
        profile = user.userprofile
        role = profile.role
        qs = Exam.objects.select_related('school', 'classroom', 'subject', 'created_by')

        if role == 'super_admin':
            return qs.all()
        elif role in ('school_admin', 'accountant'):
            return qs.filter(school=profile.school)
        elif role == 'teacher':
            return qs.filter(school=profile.school)
        elif role in ('parent', 'student'):
            return qs.filter(school=profile.school)
        return Exam.objects.none()


class ExamResultViewSet(viewsets.ModelViewSet):
    serializer_class = ExamResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return ExamResult.objects.none()
        profile = user.userprofile
        role = profile.role
        qs = ExamResult.objects.select_related('school', 'exam', 'student')

        if role == 'super_admin':
            return qs.all()
        elif role in ('school_admin', 'accountant'):
            return qs.filter(school=profile.school)
        elif role == 'teacher':
            return qs.filter(
                exam__classroom__teacherassignment__teacher__user_profile=profile
            )
        elif role == 'student':
            return qs.filter(student__user_profile=profile)
        elif role == 'parent':
            from parents.models import ParentStudent
            linked = ParentStudent.objects.filter(
                parent__user_profile=profile
            ).values_list('student_id', flat=True)
            return qs.filter(student__in=linked)
        return ExamResult.objects.none()
