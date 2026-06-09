from django.db import models


class Message(models.Model):
    """A direct message between two users within the platform."""

    class Status(models.TextChoices):
        SENT = 'sent', 'Sent'
        DELIVERED = 'delivered', 'Delivered'
        READ = 'read', 'Read'

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.CASCADE,
        related_name='messages',
    )
    sender = models.ForeignKey(
        'accounts.UserProfile',
        on_delete=models.CASCADE,
        related_name='sent_messages',
    )
    recipient = models.ForeignKey(
        'accounts.UserProfile',
        on_delete=models.CASCADE,
        related_name='received_messages',
    )
    subject = models.CharField(max_length=255, blank=True, default='')
    body = models.TextField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.SENT)
    is_school_monitored = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Message'
        verbose_name_plural = 'Messages'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.sender} → {self.recipient}: {self.subject}"


class Notification(models.Model):
    """A system notification delivered to a user."""

    school = models.ForeignKey(
        'schools.School',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notifications',
    )
    recipient = models.ForeignKey(
        'accounts.UserProfile',
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    title = models.CharField(max_length=255)
    body = models.TextField()
    type = models.CharField(max_length=50, blank=True, default='')
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Notification'
        verbose_name_plural = 'Notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} → {self.recipient}"
