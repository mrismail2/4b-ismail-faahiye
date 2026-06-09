from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Parent, ParentStudent
from .serializers import ParentSerializer, ParentStudentSerializer


class ParentViewSet(viewsets.ModelViewSet):
    """
    CRUD for Parent.
    TODO (Phase 3): Filter by request.user.userprofile.school for school isolation.
    """
    serializer_class = ParentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return Parent.objects.select_related('school', 'user_profile').all()


class ParentStudentViewSet(viewsets.ModelViewSet):
    """
    CRUD for ParentStudent links.
    TODO (Phase 3): Filter by request.user.userprofile.school for school isolation.
    """
    serializer_class = ParentStudentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return ParentStudent.objects.select_related('school', 'parent', 'student').all()
