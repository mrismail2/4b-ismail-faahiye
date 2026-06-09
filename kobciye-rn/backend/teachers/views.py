from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Teacher
from .serializers import TeacherSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    """
    CRUD for Teacher.
    TODO (Phase 3): Filter by request.user.userprofile.school for school isolation.
    """
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return Teacher.objects.select_related('school', 'user_profile').all()
