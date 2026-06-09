from rest_framework.routers import DefaultRouter
from .views import LessonPreparationViewSet

router = DefaultRouter()
router.register(r'', LessonPreparationViewSet, basename='lessonpreparation')

urlpatterns = router.urls
