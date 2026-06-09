from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Parent, ParentStudent
from .serializers import ParentSerializer, ParentStudentSerializer


class ParentViewSet(viewsets.ModelViewSet):
    serializer_class = ParentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Parent.objects.none()
        profile = user.userprofile
        role = profile.role
        qs = Parent.objects.select_related('school', 'user_profile')

        if role == 'super_admin':
            return qs.all()
        elif role in ('school_admin', 'accountant', 'teacher'):
            return qs.filter(school=profile.school)
        elif role == 'parent':
            return qs.filter(user_profile=profile)
        elif role == 'student':
            return qs.filter(school=profile.school)
        return Parent.objects.none()


class ParentStudentViewSet(viewsets.ModelViewSet):
    serializer_class = ParentStudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return ParentStudent.objects.none()
        profile = user.userprofile
        role = profile.role
        qs = ParentStudent.objects.select_related('school', 'parent', 'student')

        if role == 'super_admin':
            return qs.all()
        elif role in ('school_admin', 'accountant', 'teacher'):
            return qs.filter(school=profile.school)
        elif role == 'parent':
            return qs.filter(parent__user_profile=profile)
        elif role == 'student':
            return qs.filter(student__user_profile=profile)
        return ParentStudent.objects.none()
