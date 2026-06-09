from django.contrib import admin
from .models import Exam, ExamResult


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('title', 'school', 'classroom', 'subject', 'exam_date', 'is_published')
    search_fields = ('title', 'academic_year')
    list_filter = ('school', 'is_published', 'academic_year')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(ExamResult)
class ExamResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'marks_obtained', 'grade', 'rank', 'is_published')
    search_fields = ('student__full_name', 'exam__title')
    list_filter = ('school', 'is_published', 'exam')
    readonly_fields = ('created_at', 'updated_at')
