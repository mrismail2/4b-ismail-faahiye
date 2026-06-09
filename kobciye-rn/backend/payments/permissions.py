"""Payments app permissions — re-exports shared permission classes."""
from accounts.permissions import (
    IsSuperAdmin, IsSchoolAdmin, IsAccountant, IsActiveUser, SameSchoolOnly,
)

__all__ = ['IsSuperAdmin', 'IsSchoolAdmin', 'IsAccountant', 'IsActiveUser', 'SameSchoolOnly']
