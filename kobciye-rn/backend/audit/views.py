from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only viewset for AuditLog.
    Audit logs are never created or modified via the API.
    TODO (Phase 3): Restrict to super_admin or school_admin for their own school.
    """
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return AuditLog.objects.select_related('school', 'actor').all()
