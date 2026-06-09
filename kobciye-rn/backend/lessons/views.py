from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import LessonPreparation
from .serializers import LessonPreparationSerializer


class LessonPreparationViewSet(viewsets.ModelViewSet):
    serializer_class = LessonPreparationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return LessonPreparation.objects.none()
        profile = user.userprofile
        role = profile.role
        qs = LessonPreparation.objects.select_related(
            'school', 'teacher', 'classroom', 'subject', 'reviewed_by'
        )

        if role == 'super_admin':
            return qs.all()
        elif role in ('school_admin', 'accountant'):
            return qs.filter(school=profile.school)
        elif role == 'teacher':
            return qs.filter(teacher__user_profile=profile)
        elif role in ('parent', 'student'):
            return qs.filter(school=profile.school)
        return LessonPreparation.objects.none()
