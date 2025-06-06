from django.urls import path
from .views import VoiceCloneView, SpeakView

urlpatterns = [
    path('voice_clone/', VoiceCloneView.as_view(), name='voice_clone'),
    path('speak/', SpeakView.as_view(), name='speak_with_cloned_voice'),
]