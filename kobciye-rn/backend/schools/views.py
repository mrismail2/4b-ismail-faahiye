from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import School
from .serializers import SchoolSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    """
    CRUD for School.
    TODO (Phase 3): Restrict non-super_admin users to their own school only.
    """
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return School.objects.all()
