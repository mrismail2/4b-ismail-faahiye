from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import ClassRoom, Subject, TeacherAssignment
from .serializers import ClassRoomSerializer, SubjectSerializer, TeacherAssignmentSerializer


class ClassRoomViewSet(viewsets.ModelViewSet):
    """
    CRUD for ClassRoom.
    TODO (Phase 3): Filter by request.user.userprofile.school.
    """
    serializer_class = ClassRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return ClassRoom.objects.select_related('school').all()


class SubjectViewSet(viewsets.ModelViewSet):
    """
    CRUD for Subject.
    TODO (Phase 3): Filter by request.user.userprofile.school.
    """
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return Subject.objects.select_related('school').all()


class TeacherAssignmentViewSet(viewsets.ModelViewSet):
    """
    CRUD for TeacherAssignment.
    TODO (Phase 3): Filter by request.user.userprofile.school.
    """
    serializer_class = TeacherAssignmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return TeacherAssignment.objects.select_related('school', 'teacher', 'classroom', 'subject').all()
