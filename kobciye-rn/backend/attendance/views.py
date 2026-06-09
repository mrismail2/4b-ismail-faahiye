from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceViewSet(viewsets.ModelViewSet):
    """
    CRUD for Attendance.
    TODO (Phase 3): Filter by request.user.userprofile.school for school isolation.
    """
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return Attendance.objects.select_related('school', 'student', 'classroom', 'recorded_by').all()
