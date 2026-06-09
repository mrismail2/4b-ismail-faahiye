from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Student.objects.none()
        profile = user.userprofile
        role = profile.role
        qs = Student.objects.select_related('school', 'classroom', 'user_profile')

        if role == 'super_admin':
            return qs.all()
        elif role in ('school_admin', 'accountant'):
            return qs.filter(school=profile.school)
        elif role == 'teacher':
            return qs.filter(school=profile.school)
        elif role == 'parent':
            from parents.models import ParentStudent
            linked = ParentStudent.objects.filter(
                parent__user_profile=profile
            ).values_list('student_id', flat=True)
            return qs.filter(id__in=linked)
        elif role == 'student':
            return qs.filter(user_profile=profile)
        return Student.objects.none()
