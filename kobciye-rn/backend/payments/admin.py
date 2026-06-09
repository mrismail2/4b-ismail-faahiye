from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('student', 'amount', 'currency', 'method', 'status', 'due_date', 'paid_at')
    search_fields = ('student__full_name', 'reference_no')
    list_filter = ('school', 'status', 'method', 'currency')
    readonly_fields = ('created_at', 'updated_at')
