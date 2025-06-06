# # backend/base_app/views.py

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# # Import HttpResponse for direct binary response
# from django.http import HttpResponse 
# import os
# import uuid 
# import io 
# import json 

# # Import the new local Chatterbox utility functions
# from .utils import load_chatterbox_model, generate_audio_with_chatterbox

# # Load the model when Django app starts (or first accessed)
# # This will happen when the module is imported.
# load_chatterbox_model() 

# # In a real app, use a database or cache for session management.
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
        
#         # Generate a unique ID for this uploaded audio (acting as a 'voice_id' for the session)
#         session_voice_id = str(uuid.uuid4())
#         TEMP_UPLOADED_VOICES[session_voice_id] = audio_bytes 

#         return Response({"voice_id": session_voice_id, "message": "Voice sample uploaded. Ready for synthesis."}, status=status.HTTP_200_OK)

# class SpeakView(APIView):
#     """
#     API endpoint for generating audio from text using a previously uploaded voice.
#     This now calls the locally loaded ChatterboxTTS model.
#     """
#     def post(self, request, *args, **kwargs):
#         data = request.data
#         voice_id = data.get("voice_id")
#         text = data.get("text")
        
#         # Parameters from Streamlit frontend
#         stability_from_frontend = data.get("stability", 0.5) 
#         exaggeration = (1 - stability_from_frontend) * 1.75 + 0.25
#         exaggeration = max(0.25, min(2.0, exaggeration)) 

#         cfg_weight = data.get("similarity_boost", 0.5) 
#         cfg_weight = max(0.0, min(1.0, cfg_weight)) 

#         temperature = data.get("temperature", 0.8) 
#         seed_num = int(data.get("seed_num", 0)) 

#         if not voice_id or not text:
#             return Response({"error": "Voice ID and text are required."}, status=status.HTTP_400_BAD_REQUEST)

#         uploaded_audio_bytes = TEMP_UPLOADED_VOICES.get(voice_id)
#         if uploaded_audio_bytes is None:
#             return Response({"error": f"Voice sample with ID '{voice_id}' not found. Please upload voice again."}, status=status.HTTP_404_NOT_FOUND)

#         try:
#             # Call the local ChatterboxTTS generation function
#             generated_audio_bytes = generate_audio_with_chatterbox(
#                 text=text,
#                 audio_file_bytes=uploaded_audio_bytes,
#                 exaggeration=exaggeration,
#                 temperature=temperature,
#                 seed_num=seed_num,
#                 cfg_weight=cfg_weight
#             )
            
#             # --- THE CRUCIAL CHANGE IS HERE ---
#             # Instead of DRF's Response, use Django's native HttpResponse.
#             # This directly sets the response body to your binary audio data
#             # with the specified content type, bypassing JSON serialization.
#             return HttpResponse(generated_audio_bytes, content_type='audio/wav', status=status.HTTP_200_OK)
#             # --- END OF CHANGE ---

#         except Exception as e:
#             # Catch exceptions from generate_audio_with_chatterbox and return a proper JSON error
#             # For errors, we still want to send JSON so the frontend can parse it.
#             return Response({"error": f"Audio generation failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# backend/base_app/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse 
import os
import uuid 
import io 
import json 
import datetime

# Import the enhanced utility functions
from .utils import (
    load_chatterbox_model, 
    generate_audio_with_chatterbox, 
    generate_script_with_openai,
    generate_complete_workflow
)

# Load the model when Django app starts (or first accessed)
load_chatterbox_model() 

TEMP_UPLOADED_VOICES = {} # {unique_id: audio_bytes}

class VoiceCloneView(APIView):
    """
    API endpoint for uploading an audio file.
    It stores the audio in memory (TEMP_UPLOADED_VOICES) for later use by 'speak'.
    """
    def post(self, request, *args, **kwargs):
        if 'audio_file' not in request.FILES:
            return Response({"error": "No audio file provided."}, status=status.HTTP_400_BAD_REQUEST)

        audio_file = request.FILES['audio_file']
        audio_bytes = audio_file.read() 
        
        session_voice_id = str(uuid.uuid4())
        TEMP_UPLOADED_VOICES[session_voice_id] = audio_bytes 

        return Response({
            "voice_id": session_voice_id, 
            "message": "Voice sample uploaded successfully. Ready for synthesis.",
            "file_info": {
                "filename": audio_file.name,
                "size": len(audio_bytes)
            }
        }, status=status.HTTP_200_OK)

class GenerateScriptView(APIView):
    """
    API endpoint for generating and translating a script using OpenAI.
    Enhanced with better language handling.
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
    """
    API endpoint for generating audio from text using a previously uploaded voice.
    Enhanced with download support and better error handling.
    """
    def post(self, request, *args, **kwargs):
        data = request.data
        voice_id = data.get("voice_id")
        text = data.get("text")
        
        # Parameters from frontend
        exaggeration_from_frontend = data.get("exaggeration", 0.5)
        cfg_weight_from_frontend = data.get("cfg_weight", 0.5)
        temperature = data.get("temperature", 0.8) 
        seed_num = int(data.get("seed_num", 0)) 
        language = data.get("language", "English")
        download = data.get("download", False)  # New parameter for download

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
            
            response = HttpResponse(generated_audio_bytes, content_type='audio/wav')
            
            if download:
                # Generate a filename with timestamp
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"cloned_voice_audio_{timestamp}.wav"
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return response

        except Exception as e:
            return Response({"error": f"Audio generation failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CompleteWorkflowView(APIView):
    """
    New API endpoint for the complete workflow: 
    Generate script -> Translate -> Generate audio in one call.
    """
    def post(self, request, *args, **kwargs):
        data = request.data
        voice_id = data.get("voice_id")
        prompt = data.get("prompt")
        language = data.get("language", "English")
        
        # Audio generation parameters
        exaggeration = data.get("exaggeration", 0.5)
        cfg_weight = data.get("cfg_weight", 0.5)
        temperature = data.get("temperature", 0.8)
        seed_num = int(data.get("seed_num", 0))
        download = data.get("download", False)

        # Validation
        if not voice_id or not prompt:
            return Response({"error": "Voice ID and script prompt are required."}, status=status.HTTP_400_BAD_REQUEST)

        if not prompt.strip():
            return Response({"error": "Script prompt cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_audio_bytes = TEMP_UPLOADED_VOICES.get(voice_id)
        if uploaded_audio_bytes is None:
            return Response({"error": f"Voice sample with ID '{voice_id}' not found. Please upload voice again."}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Complete workflow
            generated_script, audio_bytes = generate_complete_workflow(
                prompt=prompt,
                language=language,
                audio_file_bytes=uploaded_audio_bytes,
                exaggeration=exaggeration,
                temperature=temperature,
                seed_num=seed_num,
                cfg_weight=cfg_weight
            )
            
            # Return both script and audio
            response_data = {
                "script": generated_script,
                "language": language,
                "prompt": prompt,
                "audio_generated": True,
                "word_count": len(generated_script.split()),
                "character_count": len(generated_script)
            }
            
            if download:
                # For download, return the audio file
                response = HttpResponse(audio_bytes, content_type='audio/wav')
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"complete_workflow_{language}_{timestamp}.wav"
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
                return response
            else:
                # For preview, return JSON with script info and audio as base64
                import base64
                response_data["audio_base64"] = base64.b64encode(audio_bytes).decode('utf-8')
                return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"Complete workflow failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DownloadAudioView(APIView):
    """
    Separate endpoint specifically for downloading audio files.
    """
    def post(self, request, *args, **kwargs):
        data = request.data
        voice_id = data.get("voice_id")
        text = data.get("text")
        
        # Parameters
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
            
            # Force download
            response = HttpResponse(generated_audio_bytes, content_type='audio/wav')
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            safe_language = language.replace(" ", "_").lower()
            filename = f"cloned_voice_{safe_language}_{timestamp}.wav"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            
            return response

        except Exception as e:
            return Response({"error": f"Audio download failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)