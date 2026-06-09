from django.contrib import admin
from .models import ClassRoom, Subject, TeacherAssignment


@admin.register(ClassRoom)
class ClassRoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'grade_level', 'academic_year', 'capacity', 'is_active')
    search_fields = ('name', 'grade_level', 'academic_year')
    list_filter = ('school', 'is_active', 'academic_year')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'school')
    search_fields = ('name', 'code')
    list_filter = ('school',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(TeacherAssignment)
class TeacherAssignmentAdmin(admin.ModelAdmin):
    list_display = ('teacher', 'classroom', 'subject', 'academic_year', 'is_class_teacher')
    search_fields = ('teacher__full_name', 'classroom__name')
    list_filter = ('school', 'is_class_teacher', 'academic_year')
    readonly_fields = ('created_at',)
