from django.db import models


class LessonPreparation(models.Model):
    """A lesson plan prepared by a teacher for a classroom/subject."""

    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        SUBMITTED = 'submitted', 'Submitted'
        APPROVED = 'approved', 'Approved'
        NEEDS_REVISION = 'needs_revision', 'Needs Revision'

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='lesson_preparations',
    )
    teacher = models.ForeignKey(
        'teachers.Teacher',
        on_delete=models.CASCADE,
        related_name='lesson_preparations',
    )
    classroom = models.ForeignKey(
        'academics.ClassRoom',
        on_delete=models.CASCADE,
        related_name='lesson_preparations',
    )
    subject = models.ForeignKey(
        'academics.Subject',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='lesson_preparations',
    )
    reviewed_by = models.ForeignKey(
        'accounts.UserProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_lessons',
    )
    title = models.CharField(max_length=255)
    objectives = models.TextField(blank=True, default='')
    content = models.TextField(blank=True, default='')
    resources = models.TextField(blank=True, default='')
    lesson_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    feedback = models.TextField(blank=True, default='')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Lesson Preparation'
        verbose_name_plural = 'Lesson Preparations'
        ordering = ['-lesson_date']

    def __str__(self):
        return f"{self.title} — {self.teacher} ({self.status})"
