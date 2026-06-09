"""Parents app permissions — re-exports shared permission classes."""
from accounts.permissions import (
    IsSuperAdmin, IsSchoolAdmin, IsParent, IsActiveUser,
    SameSchoolOnly, ParentOfStudentOnly,
)

__all__ = [
    'IsSuperAdmin', 'IsSchoolAdmin', 'IsParent', 'IsActiveUser',
    'SameSchoolOnly', 'ParentOfStudentOnly',
]
