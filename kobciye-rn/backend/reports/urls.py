from rest_framework.routers import DefaultRouter
from .views import ParentReportViewSet

router = DefaultRouter()
router.register(r'', ParentReportViewSet, basename='parentreport')

urlpatterns = router.urls
