"""School-level permission helpers. See accounts.permissions for the full set."""
from accounts.permissions import IsSuperAdmin, IsSchoolAdmin, SameSchoolOnly

__all__ = ['IsSuperAdmin', 'IsSchoolAdmin', 'SameSchoolOnly']
