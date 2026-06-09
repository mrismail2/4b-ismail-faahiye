from django.db import models


class ClassRoom(models.Model):
    """A classroom belonging to a school for a given academic year."""

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='classrooms',
    )
    name = models.CharField(max_length=100)
    grade_level = models.CharField(max_length=50, blank=True, default='')
    academic_year = models.CharField(max_length=20, blank=True, default='')
    capacity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Classroom'
        verbose_name_plural = 'Classrooms'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.academic_year})"


class Subject(models.Model):
    """A subject taught at a school."""

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='subjects',
    )
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=30, blank=True, default='')
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Subject'
        verbose_name_plural = 'Subjects'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.code})"


class TeacherAssignment(models.Model):
    """Links a teacher to a classroom (and optionally a subject) for an academic year."""

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='teacher_assignments',
    )
    teacher = models.ForeignKey(
        'teachers.Teacher',
        on_delete=models.CASCADE,
        related_name='assignments',
    )
    classroom = models.ForeignKey(
        ClassRoom,
        on_delete=models.CASCADE,
        related_name='teacher_assignments',
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='teacher_assignments',
    )
    academic_year = models.CharField(max_length=20, blank=True, default='')
    is_class_teacher = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Teacher Assignment'
        verbose_name_plural = 'Teacher Assignments'
        unique_together = ('teacher', 'classroom', 'subject', 'academic_year')

    def __str__(self):
        return f"{self.teacher} → {self.classroom} ({self.academic_year})"
