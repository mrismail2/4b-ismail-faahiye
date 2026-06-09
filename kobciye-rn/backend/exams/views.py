from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Exam, ExamResult
from .serializers import ExamSerializer, ExamResultSerializer


class ExamViewSet(viewsets.ModelViewSet):
    """
    CRUD for Exam.
    TODO (Phase 3): Filter by request.user.userprofile.school.
    """
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return Exam.objects.select_related('school', 'classroom', 'subject', 'created_by').all()


class ExamResultViewSet(viewsets.ModelViewSet):
    """
    CRUD for ExamResult.
    TODO (Phase 3): Filter by request.user.userprofile.school.
    """
    serializer_class = ExamResultSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return ExamResult.objects.select_related('school', 'exam', 'student').all()
