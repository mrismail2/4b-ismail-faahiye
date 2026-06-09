from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import ParentReport
from .serializers import ParentReportSerializer


class ParentReportViewSet(viewsets.ModelViewSet):
    """
    CRUD for ParentReport.
    TODO (Phase 3): Filter by request.user.userprofile.school for school isolation.
    """
    serializer_class = ParentReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return ParentReport.objects.select_related('school', 'student', 'generated_by').all()
