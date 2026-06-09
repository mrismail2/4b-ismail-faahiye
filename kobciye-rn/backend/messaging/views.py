from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Message, Notification
from .serializers import MessageSerializer, NotificationSerializer


class MessageViewSet(viewsets.ModelViewSet):
    """
    CRUD for Message.
    TODO (Phase 3): Filter by request.user.userprofile.school for school isolation.
    """
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return Message.objects.select_related('school', 'sender', 'recipient').all()


class NotificationViewSet(viewsets.ModelViewSet):
    """
    CRUD for Notification.
    TODO (Phase 3): Filter to only the current user's notifications.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation and user filtering will be enforced here in Phase 3.
        return Notification.objects.select_related('school', 'recipient').all()
