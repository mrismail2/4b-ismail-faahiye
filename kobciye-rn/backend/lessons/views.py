from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import LessonPreparation
from .serializers import LessonPreparationSerializer


class LessonPreparationViewSet(viewsets.ModelViewSet):
    """
    CRUD for LessonPreparation.
    TODO (Phase 3): Filter by request.user.userprofile.school for school isolation.
    """
    serializer_class = LessonPreparationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return LessonPreparation.objects.select_related(
            'school', 'teacher', 'classroom', 'subject', 'reviewed_by'
        ).all()
