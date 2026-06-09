from django.db import models


class ParentReport(models.Model):
    """A bilingual (English/Somali) report card sent to a student's parents."""

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='parent_reports',
    )
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='parent_reports',
    )
    generated_by = models.ForeignKey(
        'accounts.UserProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='generated_reports',
    )
    title = models.CharField(max_length=255)
    body_en = models.TextField(blank=True, default='')
    body_so = models.TextField(blank=True, default='')
    report_date = models.DateField(null=True, blank=True)
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Parent Report'
        verbose_name_plural = 'Parent Reports'
        ordering = ['-report_date']

    def __str__(self):
        return f"{self.title} — {self.student}"
