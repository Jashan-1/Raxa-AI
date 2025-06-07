# backend/base_app/models.py

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import uuid


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    auth_token = models.CharField(max_length=512)
    token_expiry = models.DateTimeField()
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_staff = models.BooleanField(default=False)  # Required for admin access
    is_active = models.BooleanField(default=True)  # Required for authentication

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def has_usable_password(self):
        return False  # Disable password-based authentication

    class Meta:
        db_table = 'users'

class UserInteraction(models.Model):
    interaction_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interactions')
    prompt = models.TextField()
    language = models.CharField(max_length=50)
    generated_script = models.TextField(null=True, blank=True)
    audio_generated = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    exaggeration = models.FloatField(null=True, blank=True)
    cfg_weight = models.FloatField(null=True, blank=True)
    temperature = models.FloatField(null=True, blank=True)
    seed_num = models.IntegerField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Interaction {self.interaction_id} for {self.user.email}"

    class Meta:
        db_table = 'user_interactions'  # Added for consistency
        indexes = [
            models.Index(fields=['user', 'timestamp']),
        ]