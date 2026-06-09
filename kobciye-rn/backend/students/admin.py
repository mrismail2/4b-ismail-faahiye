from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'enrollment_no', 'school', 'classroom', 'gender', 'is_active')
    search_fields = ('full_name', 'enrollment_no')
    list_filter = ('school', 'is_active', 'gender')
    readonly_fields = ('created_at', 'updated_at')
