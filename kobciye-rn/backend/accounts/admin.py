from django.contrib import admin
from .models import UserProfile, Permission, RolePermission


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'status', 'school', 'is_active', 'language')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name', 'phone')
    list_filter = ('role', 'status', 'is_active', 'language')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'module', 'created_at', 'updated_at')
    search_fields = ('code', 'name', 'module')
    list_filter = ('module',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(RolePermission)
class RolePermissionAdmin(admin.ModelAdmin):
    list_display = ('role', 'permission', 'is_allowed', 'created_at', 'updated_at')
    search_fields = ('role', 'permission__code')
    list_filter = ('role', 'is_allowed')
    readonly_fields = ('created_at', 'updated_at')
