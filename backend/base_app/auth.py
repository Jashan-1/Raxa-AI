# backend/base_app/auth.py

from mozilla_django_oidc.auth import OIDCAuthenticationBackend
from django.contrib.auth import get_user_model
from base_app.models import User
from django.db import transaction
from datetime import datetime, timedelta
import uuid

class CustomOIDCAuthenticationBackend(OIDCAuthenticationBackend):
    def create_user(self, claims):
        """
        Create a new user in the custom User model using data from Okta claims.
        """
        email = claims.get('email')
        if not email:
            raise ValueError("Email is required from Okta claims")

        # Check if user already exists
        try:
            user = User.objects.get(email=email)
            return self.update_user(user, claims)
        except User.DoesNotExist:
            pass

        # Create a new user
        with transaction.atomic():
            user = User.objects.create(
                user_id=uuid.uuid4(),
                email=email,
                auth_token=self.get_token(claims),  # Store the access token
                token_expiry=datetime.now() + timedelta(hours=1),  # Set token expiry (adjust as needed)
            )
            user.save()
        return user

    def update_user(self, user, claims):
        """
        Update an existing user with new claims from Okta.
        """
        with transaction.atomic():
            user.auth_token = self.get_token(claims)  # Update access token
            user.token_expiry = datetime.now() + timedelta(hours=1)  # Update token expiry
            user.save()
        return user

    def get_token(self, claims):
        """
        Get the access token from the OIDC session.
        """
        return self.request.session.get('oidc_access_token', '')

    def filter_users_by_claims(self, claims):
        """
        Find users by email from Okta claims.
        """
        email = claims.get('email')
        if not email:
            return self.UserModel.objects.none()
        return self.UserModel.objects.filter(email=email)