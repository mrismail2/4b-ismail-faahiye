"""Student app permissions — re-exports shared permission classes."""
from accounts.permissions import (
    IsSuperAdmin, IsSchoolAdmin, IsTeacher, IsParent, IsStudent,
    IsActiveUser, SameSchoolOnly, ParentOfStudentOnly, TeacherAssignedClassOnly,
)

__all__ = [
    'IsSuperAdmin', 'IsSchoolAdmin', 'IsTeacher', 'IsParent', 'IsStudent',
    'IsActiveUser', 'SameSchoolOnly', 'ParentOfStudentOnly', 'TeacherAssignedClassOnly',
]
