from django.contrib import admin
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'table_name', 'actor', 'school', 'ip_address', 'created_at')
    search_fields = ('action', 'table_name', 'actor__user__username')
    list_filter = ('school', 'action', 'table_name')
    readonly_fields = ('created_at', 'school', 'actor', 'action', 'table_name', 'record_id', 'old_data', 'new_data', 'ip_address')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
