# # backend/base_app/urls.py

# from django.urls import path
# from .views import (
#     VoiceCloneView, 
#     SpeakView, 
#     GenerateScriptView, 
#     CompleteWorkflowView,
#     DownloadAudioView
# )

# urlpatterns = [
#     # Voice cloning endpoint
#     path('voice_clone/', VoiceCloneView.as_view(), name='voice_clone'),
    
#     # Script generation endpoint
#     path('generate_script/', GenerateScriptView.as_view(), name='generate_script'),
    
#     # Audio generation endpoints
#     path('speak/', SpeakView.as_view(), name='speak_with_cloned_voice'),
#     path('download_audio/', DownloadAudioView.as_view(), name='download_audio'),
    
#     # Complete workflow endpoint (script + audio in one call)
#     path('complete_workflow/', CompleteWorkflowView.as_view(), name='complete_workflow'),
# ]


# backend/base_app/urls.py

from django.urls import path, include
from base_app.views import VoiceCloneView, GenerateScriptView, SpeakView, CompleteWorkflowView, DownloadAudioView

urlpatterns = [
    path('voice_clone/', VoiceCloneView.as_view(), name='voice_clone'),
    path('generate_script/', GenerateScriptView.as_view(), name='generate_script'),
    path('speak/', SpeakView.as_view(), name='speak'),
    path('complete_workflow/', CompleteWorkflowView.as_view(), name='complete_workflow'),
    path('download_audio/', DownloadAudioView.as_view(), name='download_audio'),
    path('oidc/', include('mozilla_django_oidc.urls')),  # Add OIDC URLs
]


