from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Payment
from .serializers import PaymentSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'userprofile'):
            return Payment.objects.none()
        profile = user.userprofile
        role = profile.role
        qs = Payment.objects.select_related('school', 'student', 'recorded_by')

        if role == 'super_admin':
            return qs.all()
        elif role in ('school_admin', 'accountant'):
            return qs.filter(school=profile.school)
        elif role == 'teacher':
            return qs.filter(school=profile.school)
        elif role == 'student':
            return qs.filter(student__user_profile=profile)
        elif role == 'parent':
            from parents.models import ParentStudent
            linked = ParentStudent.objects.filter(
                parent__user_profile=profile
            ).values_list('student_id', flat=True)
            return qs.filter(student__in=linked)
        return Payment.objects.none()
