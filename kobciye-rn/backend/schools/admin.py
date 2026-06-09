from django.contrib import admin
from .models import School


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'city', 'country', 'is_active')
    search_fields = ('name', 'slug', 'city', 'email')
    list_filter = ('is_active', 'country')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
