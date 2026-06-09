from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Student
from .serializers import StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    """
    CRUD for Student.
    TODO (Phase 3): Filter queryset by request.user.userprofile.school for school isolation.
    """
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return Student.objects.select_related('school', 'classroom', 'user_profile').all()
