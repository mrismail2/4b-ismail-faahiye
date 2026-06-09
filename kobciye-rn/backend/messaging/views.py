from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Message, Notification
from .serializers import MessageSerializer, NotificationSerializer


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Message.objects.none()
        profile = user.userprofile
        qs = Message.objects.select_related('school', 'sender', 'recipient')
        if profile.role == 'super_admin':
            return qs.all()
        if profile.role == 'school_admin' and profile.school:
            return qs.filter(school=profile.school)
        # teachers, parents, students see only their own sent/received messages
        return qs.filter(sender=profile) | qs.filter(recipient=profile)


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Notification.objects.none()
        profile = user.userprofile
        qs = Notification.objects.select_related('school', 'recipient')
        if profile.role == 'super_admin':
            return qs.all()
        if profile.role == 'school_admin' and profile.school:
            return qs.filter(school=profile.school)
        return qs.filter(recipient=profile)
