# backend/users/serializers.py

from django.contrib.auth import get_user_model
from rest_framework import serializers

# Get the custom User model you defined in settings.py
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    # ✅ Explicitly define the password field to be write-only
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        # Use the custom manager's create_user method
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

    class Meta:
        model = User
        # ✅ Explicitly list the fields to be used
        fields = ('email', 'password')