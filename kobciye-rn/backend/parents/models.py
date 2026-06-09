from django.db import models


class Parent(models.Model):
    """A parent or guardian linked to one or more students."""

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='parents',
    )
    user_profile = models.OneToOneField(
        'accounts.UserProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='parent_profile',
    )
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=30, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    relationship = models.CharField(max_length=50, default='parent')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Parent'
        verbose_name_plural = 'Parents'
        ordering = ['full_name']

    def __str__(self):
        return self.full_name


class ParentStudent(models.Model):
    """Many-to-many link between Parent and Student with relationship metadata."""

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='parent_student_links',
    )
    parent = models.ForeignKey(
        Parent,
        on_delete=models.CASCADE,
        related_name='student_links',
    )
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='parent_links',
    )
    relationship = models.CharField(max_length=50, default='parent')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Parent–Student Link'
        verbose_name_plural = 'Parent–Student Links'
        unique_together = ('parent', 'student')

    def __str__(self):
        return f"{self.parent} → {self.student}"
