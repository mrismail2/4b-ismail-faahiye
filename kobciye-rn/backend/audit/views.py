from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import AuditLog
from .serializers import AuditLogSerializer


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return AuditLog.objects.none()
        profile = user.userprofile
        qs = AuditLog.objects.select_related('school', 'actor')
        if profile.role == 'super_admin':
            return qs.all()
        if profile.role == 'school_admin' and profile.school:
            return qs.filter(school=profile.school)
        return AuditLog.objects.none()
