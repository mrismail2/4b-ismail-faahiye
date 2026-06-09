from django.db import models


class Exam(models.Model):
    """An exam administered within a school."""

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='exams',
    )
    classroom = models.ForeignKey(
        'academics.ClassRoom',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='exams',
    )
    subject = models.ForeignKey(
        'academics.Subject',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='exams',
    )
    created_by = models.ForeignKey(
        'accounts.UserProfile',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_exams',
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    exam_date = models.DateField(null=True, blank=True)
    total_marks = models.DecimalField(max_digits=7, decimal_places=2, default=100)
    pass_marks = models.DecimalField(max_digits=7, decimal_places=2, default=50)
    academic_year = models.CharField(max_length=20, blank=True, default='')
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Exam'
        verbose_name_plural = 'Exams'
        ordering = ['-exam_date']

    def __str__(self):
        return self.title


class ExamResult(models.Model):
    """A student's result for a specific exam."""

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='exam_results',
    )
    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name='results',
    )
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='exam_results',
    )
    marks_obtained = models.DecimalField(max_digits=7, decimal_places=2, default=0)
    grade = models.CharField(max_length=10, blank=True, default='')
    rank = models.PositiveIntegerField(null=True, blank=True)
    remarks = models.TextField(blank=True, default='')
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Exam Result'
        verbose_name_plural = 'Exam Results'
        unique_together = ('exam', 'student')

    def __str__(self):
        return f"{self.student} — {self.exam} ({self.marks_obtained})"
