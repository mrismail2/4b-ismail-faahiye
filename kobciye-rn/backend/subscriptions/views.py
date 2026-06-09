from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Plan, Subscription
from .serializers import PlanSerializer, SubscriptionSerializer


class PlanViewSet(viewsets.ModelViewSet):
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Plan.objects.none()
        profile = user.userprofile
        if profile.role == 'super_admin':
            return Plan.objects.all()
        # all authenticated school members may read active plans (pricing)
        return Plan.objects.filter(is_active=True)


class SubscriptionViewSet(viewsets.ModelViewSet):
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Subscription.objects.none()
        profile = user.userprofile
        qs = Subscription.objects.select_related('school', 'plan')
        if profile.role == 'super_admin':
            return qs.all()
        if profile.school:
            return qs.filter(school=profile.school)
        return Subscription.objects.none()
