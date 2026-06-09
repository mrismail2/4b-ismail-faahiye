from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import School
from .serializers import SchoolSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return School.objects.none()
        profile = user.userprofile
        if profile.role == 'super_admin':
            return School.objects.all()
        if profile.school:
            return School.objects.filter(id=profile.school_id)
        return School.objects.none()
