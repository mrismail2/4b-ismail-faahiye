from rest_framework.routers import DefaultRouter
from .views import ParentViewSet, ParentStudentViewSet

router = DefaultRouter()
router.register(r'parents', ParentViewSet, basename='parent')
router.register(r'parent-students', ParentStudentViewSet, basename='parentstudent')

urlpatterns = router.urls
