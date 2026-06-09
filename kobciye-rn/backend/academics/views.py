from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import ClassRoom, Subject, TeacherAssignment
from .serializers import ClassRoomSerializer, SubjectSerializer, TeacherAssignmentSerializer


class ClassRoomViewSet(viewsets.ModelViewSet):
    serializer_class = ClassRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return ClassRoom.objects.none()
        profile = user.userprofile
        qs = ClassRoom.objects.select_related('school')
        if profile.role == 'super_admin':
            return qs.all()
        if profile.role == 'teacher':
            return qs.filter(teacherassignment__teacher__user_profile=profile).distinct()
        if profile.school:
            return qs.filter(school=profile.school)
        return ClassRoom.objects.none()


class SubjectViewSet(viewsets.ModelViewSet):
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Subject.objects.none()
        profile = user.userprofile
        qs = Subject.objects.select_related('school')
        if profile.role == 'super_admin':
            return qs.all()
        if profile.role == 'teacher':
            return qs.filter(teacherassignment__teacher__user_profile=profile).distinct()
        if profile.school:
            return qs.filter(school=profile.school)
        return Subject.objects.none()


class TeacherAssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = TeacherAssignmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return TeacherAssignment.objects.none()
        profile = user.userprofile
        qs = TeacherAssignment.objects.select_related('school', 'teacher', 'classroom', 'subject')
        if profile.role == 'super_admin':
            return qs.all()
        if profile.role == 'teacher':
            return qs.filter(teacher__user_profile=profile)
        if profile.school:
            return qs.filter(school=profile.school)
        return TeacherAssignment.objects.none()
