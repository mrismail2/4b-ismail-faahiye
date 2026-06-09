from django.contrib import admin
from .models import Plan, Subscription


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'tier', 'price_usd', 'max_students', 'is_active')
    search_fields = ('name', 'tier')
    list_filter = ('is_active', 'tier')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('school', 'plan', 'status', 'trial_ends_at', 'current_period_end')
    search_fields = ('school__name',)
    list_filter = ('status', 'plan')
    readonly_fields = ('created_at', 'updated_at')
