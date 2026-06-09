from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """
    Extends the built-in Django User with school context and role information.
    New users default to role=parent, status=inactive, is_active=False, school=null.
    """

    class Role(models.TextChoices):
        SUPER_ADMIN = 'super_admin', 'Super Admin'
        SCHOOL_ADMIN = 'school_admin', 'School Admin'
        TEACHER = 'teacher', 'Teacher'
        ACCOUNTANT = 'accountant', 'Accountant'
        PARENT = 'parent', 'Parent'
        STUDENT = 'student', 'Student'

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        INACTIVE = 'inactive', 'Inactive'
        SUSPENDED = 'suspended', 'Suspended'

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='userprofile',
    )
    school = models.ForeignKey(
        'schools.School',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='user_profiles',
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.PARENT,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.INACTIVE,
    )
    is_active = models.BooleanField(default=False)
    phone = models.CharField(max_length=30, blank=True, default='')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    language = models.CharField(max_length=10, default='en')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.role})"


class Permission(models.Model):
    code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    module = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['module', 'code']

    def __str__(self):
        return f"{self.module}.{self.code}"


ROLE_CHOICES = [
    ('super_admin', 'Super Admin'),
    ('school_admin', 'School Admin'),
    ('teacher', 'Teacher'),
    ('accountant', 'Accountant'),
    ('parent', 'Parent'),
    ('student', 'Student'),
]


class RolePermission(models.Model):
    role = models.CharField(max_length=30, choices=ROLE_CHOICES)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='role_permissions')
    is_allowed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('role', 'permission')
        ordering = ['role', 'permission__code']

    def __str__(self):
        return f"{self.role} — {self.permission.code}"
