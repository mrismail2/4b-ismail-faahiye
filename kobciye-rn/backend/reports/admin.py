from django.contrib import admin
from .models import ParentReport


@admin.register(ParentReport)
class ParentReportAdmin(admin.ModelAdmin):
    list_display = ('title', 'student', 'school', 'report_date', 'is_sent', 'sent_at')
    search_fields = ('title', 'student__full_name')
    list_filter = ('school', 'is_sent', 'report_date')
    readonly_fields = ('created_at', 'updated_at')
