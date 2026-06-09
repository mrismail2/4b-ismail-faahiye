from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, PermissionViewSet, RolePermissionViewSet

router = DefaultRouter()
router.register(r'userprofiles', UserProfileViewSet, basename='userprofile')
router.register(r'permissions', PermissionViewSet, basename='permission')
router.register(r'role-permissions', RolePermissionViewSet, basename='rolepermission')

urlpatterns = router.urls
