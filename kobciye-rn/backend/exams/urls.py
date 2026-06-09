from rest_framework.routers import DefaultRouter
from .views import ExamViewSet, ExamResultViewSet

router = DefaultRouter()
router.register(r'exams', ExamViewSet, basename='exam')
router.register(r'results', ExamResultViewSet, basename='examresult')

urlpatterns = router.urls
