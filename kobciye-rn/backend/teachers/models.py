from django.db import models


class Teacher(models.Model):
    """A teacher employed at a school."""

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='teachers',
    )
    user_profile = models.OneToOneField(
        'accounts.UserProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='teacher_profile',
    )
    full_name = models.CharField(max_length=255)
    employee_no = models.CharField(max_length=50, blank=True, default='')
    specialization = models.CharField(max_length=255, blank=True, default='')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Teacher'
        verbose_name_plural = 'Teachers'
        ordering = ['full_name']

    def __str__(self):
        return f"{self.full_name} ({self.employee_no})"
