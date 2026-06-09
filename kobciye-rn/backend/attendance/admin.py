from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'date', 'status', 'classroom', 'school', 'recorded_by')
    search_fields = ('student__full_name',)
    list_filter = ('school', 'status', 'date')
    readonly_fields = ('created_at', 'updated_at')
