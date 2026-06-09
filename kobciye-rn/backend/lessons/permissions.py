"""Lessons app permissions — re-exports shared permission classes."""
from accounts.permissions import (
    IsSuperAdmin, IsSchoolAdmin, IsTeacher, IsActiveUser, SameSchoolOnly,
)

__all__ = ['IsSuperAdmin', 'IsSchoolAdmin', 'IsTeacher', 'IsActiveUser', 'SameSchoolOnly']
