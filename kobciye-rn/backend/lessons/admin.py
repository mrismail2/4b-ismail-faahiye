from django.contrib import admin
from .models import LessonPreparation


@admin.register(LessonPreparation)
class LessonPreparationAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher', 'classroom', 'subject', 'lesson_date', 'status')
    search_fields = ('title', 'teacher__full_name', 'classroom__name')
    list_filter = ('school', 'status', 'lesson_date')
    readonly_fields = ('created_at', 'updated_at')
