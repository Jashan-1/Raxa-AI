# # backend/base_app/views.py

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from django.http import HttpResponse 
# import os
# import uuid 
# import io 
# import json 
# import datetime

# # Import the enhanced utility functions
# from .utils import (
#     load_chatterbox_model, 
#     generate_audio_with_chatterbox, 
#     generate_script_with_openai,
#     generate_complete_workflow
# )

# # Load the model when Django app starts (or first accessed)
# load_chatterbox_model() 

# TEMP_UPLOADED_VOICES = {} # {unique_id: audio_bytes}

# class VoiceCloneView(APIView):
#     """
#     API endpoint for uploading an audio file.
#     It stores the audio in memory (TEMP_UPLOADED_VOICES) for later use by 'speak'.
#     """
#     def post(self, request, *args, **kwargs):
#         if 'audio_file' not in request.FILES:
#             return Response({"error": "No audio file provided."}, status=status.HTTP_400_BAD_REQUEST)

#         audio_file = request.FILES['audio_file']
#         audio_bytes = audio_file.read() 
        
#         session_voice_id = str(uuid.uuid4())
#         TEMP_UPLOADED_VOICES[session_voice_id] = audio_bytes 

#         return Response({
#             "voice_id": session_voice_id, 
#             "message": "Voice sample uploaded successfully. Ready for synthesis.",
#             "file_info": {
#                 "filename": audio_file.name,
#                 "size": len(audio_bytes)
#             }
#         }, status=status.HTTP_200_OK)

# class GenerateScriptView(APIView):
#     """
#     API endpoint for generating and translating a script using OpenAI.
#     Enhanced with better language handling.
#     """
#     def post(self, request, *args, **kwargs):
#         data = request.data
#         prompt = data.get("prompt")
#         language = data.get("language", "English")

#         if not prompt:
#             return Response({"error": "Script prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

#         if not prompt.strip():
#             return Response({"error": "Script prompt cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             generated_script = generate_script_with_openai(prompt, language)
#             return Response({
#                 "script": generated_script,
#                 "language": language,
#                 "prompt": prompt,
#                 "word_count": len(generated_script.split()),
#                 "character_count": len(generated_script)
#             }, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({"error": f"Script generation failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class SpeakView(APIView):
#     """
#     API endpoint for generating audio from text using a previously uploaded voice.
#     Enhanced with download support and better error handling.
#     """
#     def post(self, request, *args, **kwargs):
#         data = request.data
#         voice_id = data.get("voice_id")
#         text = data.get("text")
        
#         # Parameters from frontend
#         exaggeration_from_frontend = data.get("exaggeration", 0.5)
#         cfg_weight_from_frontend = data.get("cfg_weight", 0.5)
#         temperature = data.get("temperature", 0.8) 
#         seed_num = int(data.get("seed_num", 0)) 
#         language = data.get("language", "English")
#         download = data.get("download", False)  # New parameter for download

#         if not voice_id or not text:
#             return Response({"error": "Voice ID and text are required."}, status=status.HTTP_400_BAD_REQUEST)

#         if not text.strip():
#             return Response({"error": "Text cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

#         uploaded_audio_bytes = TEMP_UPLOADED_VOICES.get(voice_id)
#         if uploaded_audio_bytes is None:
#             return Response({"error": f"Voice sample with ID '{voice_id}' not found. Please upload voice again."}, status=status.HTTP_404_NOT_FOUND)

#         try:
#             generated_audio_bytes = generate_audio_with_chatterbox(
#                 text=text,
#                 audio_file_bytes=uploaded_audio_bytes,
#                 exaggeration=exaggeration_from_frontend,
#                 temperature=temperature,
#                 seed_num=seed_num,
#                 cfg_weight=cfg_weight_from_frontend
#             )
            
#             response = HttpResponse(generated_audio_bytes, content_type='audio/wav')
            
#             if download:
#                 # Generate a filename with timestamp
#                 timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
#                 filename = f"cloned_voice_audio_{timestamp}.wav"
#                 response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
#             return response

#         except Exception as e:
#             return Response({"error": f"Audio generation failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class CompleteWorkflowView(APIView):
#     """
#     New API endpoint for the complete workflow: 
#     Generate script -> Translate -> Generate audio in one call.
#     """
#     def post(self, request, *args, **kwargs):
#         data = request.data
#         voice_id = data.get("voice_id")
#         prompt = data.get("prompt")
#         language = data.get("language", "English")
        
#         # Audio generation parameters
#         exaggeration = data.get("exaggeration", 0.5)
#         cfg_weight = data.get("cfg_weight", 0.5)
#         temperature = data.get("temperature", 0.8)
#         seed_num = int(data.get("seed_num", 0))
#         download = data.get("download", False)

#         # Validation
#         if not voice_id or not prompt:
#             return Response({"error": "Voice ID and script prompt are required."}, status=status.HTTP_400_BAD_REQUEST)

#         if not prompt.strip():
#             return Response({"error": "Script prompt cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

#         uploaded_audio_bytes = TEMP_UPLOADED_VOICES.get(voice_id)
#         if uploaded_audio_bytes is None:
#             return Response({"error": f"Voice sample with ID '{voice_id}' not found. Please upload voice again."}, status=status.HTTP_404_NOT_FOUND)

#         try:
#             # Complete workflow
#             generated_script, audio_bytes = generate_complete_workflow(
#                 prompt=prompt,
#                 language=language,
#                 audio_file_bytes=uploaded_audio_bytes,
#                 exaggeration=exaggeration,
#                 temperature=temperature,
#                 seed_num=seed_num,
#                 cfg_weight=cfg_weight
#             )
            
#             # Return both script and audio
#             response_data = {
#                 "script": generated_script,
#                 "language": language,
#                 "prompt": prompt,
#                 "audio_generated": True,
#                 "word_count": len(generated_script.split()),
#                 "character_count": len(generated_script)
#             }
            
#             if download:
#                 # For download, return the audio file
#                 response = HttpResponse(audio_bytes, content_type='audio/wav')
#                 timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
#                 filename = f"complete_workflow_{language}_{timestamp}.wav"
#                 response['Content-Disposition'] = f'attachment; filename="{filename}"'
#                 return response
#             else:
#                 # For preview, return JSON with script info and audio as base64
#                 import base64
#                 response_data["audio_base64"] = base64.b64encode(audio_bytes).decode('utf-8')
#                 return Response(response_data, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"error": f"Complete workflow failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class DownloadAudioView(APIView):
#     """
#     Separate endpoint specifically for downloading audio files.
#     """
#     def post(self, request, *args, **kwargs):
#         data = request.data
#         voice_id = data.get("voice_id")
#         text = data.get("text")
        
#         # Parameters
#         exaggeration = data.get("exaggeration", 0.5)
#         cfg_weight = data.get("cfg_weight", 0.5)
#         temperature = data.get("temperature", 0.8)
#         seed_num = int(data.get("seed_num", 0))
#         language = data.get("language", "English")

#         if not voice_id or not text:
#             return Response({"error": "Voice ID and text are required."}, status=status.HTTP_400_BAD_REQUEST)

#         uploaded_audio_bytes = TEMP_UPLOADED_VOICES.get(voice_id)
#         if uploaded_audio_bytes is None:
#             return Response({"error": f"Voice sample with ID '{voice_id}' not found."}, status=status.HTTP_404_NOT_FOUND)

#         try:
#             generated_audio_bytes = generate_audio_with_chatterbox(
#                 text=text,
#                 audio_file_bytes=uploaded_audio_bytes,
#                 exaggeration=exaggeration,
#                 temperature=temperature,
#                 seed_num=seed_num,
#                 cfg_weight=cfg_weight
#             )
            
#             # Force download
#             response = HttpResponse(generated_audio_bytes, content_type='audio/wav')
#             timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
#             safe_language = language.replace(" ", "_").lower()
#             filename = f"cloned_voice_{safe_language}_{timestamp}.wav"
#             response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
#             return response

#         except Exception as e:
#             return Response({"error": f"Audio download failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




# backend/base_app/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.http import HttpResponse 
import os
import uuid 
import datetime
from django.utils import timezone
import base64
from .utils import (
    load_chatterbox_model, 
    generate_audio_with_chatterbox, 
    generate_script_with_openai,
    generate_complete_workflow
)
from .models import UserInteraction  # Import UserInteraction model
# Temporarily use a dictionary until Okta is set up
TEMP_UPLOADED_VOICES = {}  # {unique_id: audio_bytes}

# Load the model when Django app starts
load_chatterbox_model()


def get_anonymous_user():
    from .models import User
    anonymous_user, created = User.objects.get_or_create(
        email='anonymous@system.local',
        defaults={
            'user_id': uuid.uuid4(),
            'auth_token': 'anonymous',
            'token_expiry': timezone.now() + timezone.timedelta(days=365*10),  # 10 years
            'is_active': True,
        }
    )
    return anonymous_user

class VoiceCloneView(APIView):
    permission_classes = [AllowAny]
    
    """
    API endpoint for uploading an audio file.
    Stores the audio in the database for later use by 'speak'.
    """
    def post(self, request, *args, **kwargs):
        if 'audio_file' not in request.FILES:
            return Response({"error": "No audio file provided."}, status=status.HTTP_400_BAD_REQUEST)

        audio_file = request.FILES['audio_file']
        audio_bytes = audio_file.read() 
        
        # Generate a unique ID for this uploaded audio
        session_voice_id = str(uuid.uuid4())
        TEMP_UPLOADED_VOICES[session_voice_id] = audio_bytes  # Replace this with DB storage later

        return Response({
            "voice_id": session_voice_id, 
            "message": "Voice sample uploaded successfully. Ready for synthesis.",
            "file_info": {
                "filename": audio_file.name,
                "size": len(audio_bytes)
            }
        }, status=status.HTTP_200_OK)

class GenerateScriptView(APIView):
    permission_classes = [AllowAny]
    
    """
    API endpoint for generating and translating a script using OpenAI.
    """
    def post(self, request, *args, **kwargs):
        data = request.data
        prompt = data.get("prompt")
        language = data.get("language", "English")

        if not prompt:
            return Response({"error": "Script prompt is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not prompt.strip():
            return Response({"error": "Script prompt cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            generated_script = generate_script_with_openai(prompt, language)
            # Log the interaction (user will be added after Okta setup)
            UserInteraction.objects.create(
                user=get_anonymous_user(),  # ✅ Pass User instance
                prompt=prompt,
                language=language,
                generated_script=generated_script,
                audio_generated=False
            )
            return Response({
                "script": generated_script,
                "language": language,
                "prompt": prompt,
                "word_count": len(generated_script.split()),
                "character_count": len(generated_script)
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"Script generation failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SpeakView(APIView):
    permission_classes = [AllowAny]
    
    """
    API endpoint for generating audio from text using a previously uploaded voice.
    """
    def post(self, request, *args, **kwargs):
        data = request.data
        voice_id = data.get("voice_id")
        text = data.get("text")
        
        exaggeration_from_frontend = data.get("exaggeration", 0.5)
        cfg_weight_from_frontend = data.get("cfg_weight", 0.5)
        temperature = data.get("temperature", 0.8) 
        seed_num = int(data.get("seed_num", 0)) 
        language = data.get("language", "English")
        download = data.get("download", False)

        if not voice_id or not text:
            return Response({"error": "Voice ID and text are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not text.strip():
            return Response({"error": "Text cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_audio_bytes = TEMP_UPLOADED_VOICES.get(voice_id)
        if uploaded_audio_bytes is None:
            return Response({"error": f"Voice sample with ID '{voice_id}' not found. Please upload voice again."}, status=status.HTTP_404_NOT_FOUND)

        try:
            generated_audio_bytes = generate_audio_with_chatterbox(
                text=text,
                audio_file_bytes=uploaded_audio_bytes,
                exaggeration=exaggeration_from_frontend,
                temperature=temperature,
                seed_num=seed_num,
                cfg_weight=cfg_weight_from_frontend
            )
            
            # Log the interaction
            UserInteraction.objects.create(
                user=get_anonymous_user(),  # ✅ Use this instead of user_id=uuid.uuid4()
                prompt=text,
                language=language,
                generated_script=text,
                audio_generated=True,
                exaggeration=exaggeration_from_frontend,
                cfg_weight=cfg_weight_from_frontend,
                temperature=temperature,
                seed_num=seed_num
            )
            
            # ✅ Return binary audio data with correct headers
            response = HttpResponse(generated_audio_bytes, content_type='audio/wav')
            response['Content-Length'] = len(generated_audio_bytes)
            
            if download:
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"cloned_voice_audio_{timestamp}.wav"
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return response

        except Exception as e:
            return Response({"error": f"Audio generation failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CompleteWorkflowView(APIView):
    permission_classes = [AllowAny]
    
    """
    API endpoint for the complete workflow: 
    Generate script -> Translate -> Generate audio in one call.
    """
    def post(self, request, *args, **kwargs):
        data = request.data
        voice_id = data.get("voice_id")
        prompt = data.get("prompt")
        language = data.get("language", "English")
        
        exaggeration = data.get("exaggeration", 0.5)
        cfg_weight = data.get("cfg_weight", 0.5)
        temperature = data.get("temperature", 0.8)
        seed_num = int(data.get("seed_num", 0))
        download = data.get("download", False)

        if not voice_id or not prompt:
            return Response({"error": "Voice ID and script prompt are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not prompt.strip():
            return Response({"error": "Script prompt cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_audio_bytes = TEMP_UPLOADED_VOICES.get(voice_id)
        if uploaded_audio_bytes is None:
            return Response({"error": f"Voice sample with ID '{voice_id}' not found. Please upload voice again."}, status=status.HTTP_404_NOT_FOUND)

        try:
            generated_script, audio_bytes = generate_complete_workflow(
                prompt=prompt,
                language=language,
                audio_file_bytes=uploaded_audio_bytes,
                exaggeration=exaggeration,
                temperature=temperature,
                seed_num=seed_num,
                cfg_weight=cfg_weight
            )
            
            # Log the interaction
            UserInteraction.objects.create(
                user=get_anonymous_user(),  # ✅ Use this instead of user_id=uuid.uuid4()
                prompt=prompt,
                language=language,
                generated_script=generated_script,
                audio_generated=True,
                exaggeration=exaggeration,
                cfg_weight=cfg_weight,
                temperature=temperature,
                seed_num=seed_num
            )
            
            response_data = {
                "script": generated_script,
                "language": language,
                "prompt": prompt,
                "audio_generated": True,
                "word_count": len(generated_script.split()),
                "character_count": len(generated_script)
            }
            
            if download:
                response = HttpResponse(audio_bytes, content_type='audio/wav')
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"complete_workflow_{language}_{timestamp}.wav"
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
                return response
            else:
                response_data["audio_base64"] = base64.b64encode(audio_bytes).decode('utf-8')
                return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Complete workflow failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DownloadAudioView(APIView):
    permission_classes = [AllowAny]
    
    """
    Separate endpoint specifically for downloading audio files.
    """
    def post(self, request, *args, **kwargs):
        data = request.data
        voice_id = data.get("voice_id")
        text = data.get("text")
        
        exaggeration = data.get("exaggeration", 0.5)
        cfg_weight = data.get("cfg_weight", 0.5)
        temperature = data.get("temperature", 0.8)
        seed_num = int(data.get("seed_num", 0))
        language = data.get("language", "English")

        if not voice_id or not text:
            return Response({"error": "Voice ID and text are required."}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_audio_bytes = TEMP_UPLOADED_VOICES.get(voice_id)
        if uploaded_audio_bytes is None:
            return Response({"error": f"Voice sample with ID '{voice_id}' not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            generated_audio_bytes = generate_audio_with_chatterbox(
                text=text,
                audio_file_bytes=uploaded_audio_bytes,
                exaggeration=exaggeration,
                temperature=temperature,
                seed_num=seed_num,
                cfg_weight=cfg_weight
            )
            
            # Log the interaction
            UserInteraction.objects.create(
                user=get_anonymous_user(),  # ✅ Use this instead of user_id=uuid.uuid4()
                prompt=text,
                language=language,
                generated_script=text,
                audio_generated=True,
                exaggeration=exaggeration,
                cfg_weight=cfg_weight,
                temperature=temperature,
                seed_num=seed_num
            )
            
            response = HttpResponse(generated_audio_bytes, content_type='audio/wav')
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            safe_language = language.replace(" ", "_").lower()
            filename = f"cloned_voice_{safe_language}_{timestamp}.wav"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return response

        except Exception as e:
            return Response({"error": f"Audio download failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)