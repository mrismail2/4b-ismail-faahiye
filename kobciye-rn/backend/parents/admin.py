from django.contrib import admin
from .models import Parent, ParentStudent


@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'school', 'phone', 'email', 'relationship', 'is_active')
    search_fields = ('full_name', 'phone', 'email')
    list_filter = ('school', 'is_active', 'relationship')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ParentStudent)
class ParentStudentAdmin(admin.ModelAdmin):
    list_display = ('parent', 'student', 'school', 'relationship', 'is_primary')
    search_fields = ('parent__full_name', 'student__full_name')
    list_filter = ('school', 'is_primary', 'relationship')
    readonly_fields = ('created_at',)
