from django.contrib import admin
from .models import Teacher


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'employee_no', 'school', 'specialization', 'is_active')
    search_fields = ('full_name', 'employee_no', 'specialization')
    list_filter = ('school', 'is_active')
    readonly_fields = ('created_at', 'updated_at')
