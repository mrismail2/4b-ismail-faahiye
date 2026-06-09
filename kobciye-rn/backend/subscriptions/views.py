from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Plan, Subscription
from .serializers import PlanSerializer, SubscriptionSerializer


class PlanViewSet(viewsets.ModelViewSet):
    """
    CRUD for Plan (subscription tiers).
    Typically restricted to super_admin in Phase 3.
    """
    serializer_class = PlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Super-admin-only restriction will be enforced here in Phase 3.
        return Plan.objects.all()


class SubscriptionViewSet(viewsets.ModelViewSet):
    """
    CRUD for Subscription.
    TODO (Phase 3): Restrict to the requesting school's own subscription.
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return Subscription.objects.select_related('school', 'plan').all()
