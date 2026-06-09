from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import UserProfile
from .serializers import UserProfileSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    CRUD for UserProfile.
    TODO (Phase 3): Override get_queryset to filter by request.user.userprofile.school
                    for non-super_admin users.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return UserProfile.objects.select_related('user', 'school').all()
