"""
Kobciye root URL configuration.
All app APIs are mounted under /api/v1/<app>/
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/accounts/', include('accounts.urls')),
    path('api/v1/schools/', include('schools.urls')),
    path('api/v1/students/', include('students.urls')),
    path('api/v1/parents/', include('parents.urls')),
    path('api/v1/teachers/', include('teachers.urls')),
    path('api/v1/academics/', include('academics.urls')),
    path('api/v1/attendance/', include('attendance.urls')),
    path('api/v1/exams/', include('exams.urls')),
    path('api/v1/payments/', include('payments.urls')),
    path('api/v1/lessons/', include('lessons.urls')),
    path('api/v1/messaging/', include('messaging.urls')),
    path('api/v1/reports/', include('reports.urls')),
    path('api/v1/subscriptions/', include('subscriptions.urls')),
    path('api/v1/audit/', include('audit.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
