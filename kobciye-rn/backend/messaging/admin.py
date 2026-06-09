from django.contrib import admin
from .models import Message, Notification


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'subject', 'status', 'is_school_monitored', 'created_at')
    search_fields = ('sender__user__username', 'recipient__user__username', 'subject')
    list_filter = ('school', 'status', 'is_school_monitored')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'recipient', 'type', 'is_read', 'created_at')
    search_fields = ('title', 'recipient__user__username')
    list_filter = ('school', 'is_read', 'type')
    readonly_fields = ('created_at',)
