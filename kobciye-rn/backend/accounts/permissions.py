"""
Custom DRF permission classes for Kobciye School Management SaaS.
These classes control access based on user role, school membership, and object ownership.
"""

from rest_framework.permissions import BasePermission


# ---------------------------------------------------------------------------
# Standalone helper functions
# ---------------------------------------------------------------------------

def is_super_admin(user):
    return hasattr(user, 'userprofile') and user.userprofile.role == 'super_admin' and user.userprofile.is_active

def is_school_admin(user):
    return hasattr(user, 'userprofile') and user.userprofile.role == 'school_admin' and user.userprofile.is_active

def is_teacher(user):
    return hasattr(user, 'userprofile') and user.userprofile.role == 'teacher' and user.userprofile.is_active

def is_accountant(user):
    return hasattr(user, 'userprofile') and user.userprofile.role == 'accountant' and user.userprofile.is_active

def is_parent(user):
    return hasattr(user, 'userprofile') and user.userprofile.role == 'parent' and user.userprofile.is_active

def is_student(user):
    return hasattr(user, 'userprofile') and user.userprofile.role == 'student' and user.userprofile.is_active

def get_user_school(user):
    if hasattr(user, 'userprofile'):
        return user.userprofile.school
    return None

def same_school(user, obj):
    school = get_user_school(user)
    return school is not None and hasattr(obj, 'school') and obj.school == school

def parent_of_student(user, student):
    if not hasattr(user, 'userprofile'):
        return False
    from parents.models import ParentStudent
    return ParentStudent.objects.filter(
        parent__user_profile=user.userprofile,
        student=student
    ).exists()

def teacher_assigned_to_class(user, class_obj):
    if not hasattr(user, 'userprofile'):
        return False
    from academics.models import TeacherAssignment
    return TeacherAssignment.objects.filter(
        teacher__user_profile=user.userprofile,
        classroom=class_obj
    ).exists()


def _get_profile(request):
    """Helper to safely retrieve the UserProfile from the request user."""
    try:
        return request.user.userprofile
    except Exception:
        return None


class IsActiveUser(BasePermission):
    """
    Allows access only to users whose UserProfile.is_active is True
    and whose UserProfile.status is 'active'.
    """

    def has_permission(self, request, view):
        profile = _get_profile(request)
        if not profile:
            return False
        return profile.is_active and profile.status == 'active'


class IsSuperAdmin(BasePermission):
    """
    Allows access only to users with role='super_admin'.
    Super admins have platform-wide access across all schools.
    """

    def has_permission(self, request, view):
        profile = _get_profile(request)
        return bool(profile and profile.role == 'super_admin')


class IsSchoolAdmin(BasePermission):
    """
    Allows access only to users with role='school_admin'.
    School admins manage a single school's data.
    """

    def has_permission(self, request, view):
        profile = _get_profile(request)
        return bool(profile and profile.role == 'school_admin')


class IsTeacher(BasePermission):
    """
    Allows access only to users with role='teacher'.
    Teachers can view and manage classroom-related data.
    """

    def has_permission(self, request, view):
        profile = _get_profile(request)
        return bool(profile and profile.role == 'teacher')


class IsAccountant(BasePermission):
    """
    Allows access only to users with role='accountant'.
    Accountants manage financial records within their school.
    """

    def has_permission(self, request, view):
        profile = _get_profile(request)
        return bool(profile and profile.role == 'accountant')


class IsParent(BasePermission):
    """
    Allows access only to users with role='parent'.
    Parents can view data related to their linked students.
    """

    def has_permission(self, request, view):
        profile = _get_profile(request)
        return bool(profile and profile.role == 'parent')


class IsStudent(BasePermission):
    """
    Allows access only to users with role='student'.
    Students can view their own academic and attendance data.
    """

    def has_permission(self, request, view):
        profile = _get_profile(request)
        return bool(profile and profile.role == 'student')


class SameSchoolOnly(BasePermission):
    """
    Object-level permission: allows access only if the requesting user's school
    matches the object's school field. Used to enforce school data isolation.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        profile = _get_profile(request)
        if not profile:
            return False
        # Super admins bypass school isolation
        if profile.role == 'super_admin':
            return True
        obj_school = getattr(obj, 'school', None)
        return obj_school is not None and obj_school == profile.school


class ParentOfStudentOnly(BasePermission):
    """
    Object-level permission: allows access only if the requesting user is a parent
    who is linked to the student associated with the object (via ParentStudent).
    """

    def has_permission(self, request, view):
        profile = _get_profile(request)
        return bool(profile and profile.role == 'parent')

    def has_object_permission(self, request, view, obj):
        from parents.models import ParentStudent

        profile = _get_profile(request)
        if not profile:
            return False
        student = getattr(obj, 'student', obj)  # obj may be the student itself
        return ParentStudent.objects.filter(
            parent__user_profile=profile,
            student=student,
        ).exists()


class TeacherAssignedClassOnly(BasePermission):
    """
    Object-level permission: allows access only if the requesting teacher
    has a TeacherAssignment for the classroom linked to the object.
    """

    def has_permission(self, request, view):
        profile = _get_profile(request)
        return bool(profile and profile.role == 'teacher')

    def has_object_permission(self, request, view, obj):
        from academics.models import TeacherAssignment

        profile = _get_profile(request)
        if not profile:
            return False
        classroom = getattr(obj, 'classroom', None)
        if classroom is None:
            return False
        return TeacherAssignment.objects.filter(
            teacher__user_profile=profile,
            classroom=classroom,
        ).exists()
