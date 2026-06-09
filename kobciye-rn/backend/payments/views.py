from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    """
    CRUD for Payment.
    TODO (Phase 3): Filter by request.user.userprofile.school for school isolation.
    """
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # School isolation will be enforced here in Phase 3.
        return Payment.objects.select_related('school', 'student', 'recorded_by').all()
