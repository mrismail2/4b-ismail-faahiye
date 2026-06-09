from rest_framework.routers import DefaultRouter
from .views import ClassRoomViewSet, SubjectViewSet, TeacherAssignmentViewSet

router = DefaultRouter()
router.register(r'classrooms', ClassRoomViewSet, basename='classroom')
router.register(r'subjects', SubjectViewSet, basename='subject')
router.register(r'teacher-assignments', TeacherAssignmentViewSet, basename='teacherassignment')

urlpatterns = router.urls
