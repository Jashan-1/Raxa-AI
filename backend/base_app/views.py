# backend/base_app/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Import HttpResponse for direct binary response
from django.http import HttpResponse 
import os
import uuid 
import io 
import json 

# Import the new local Chatterbox utility functions
from .utils import load_chatterbox_model, generate_audio_with_chatterbox

# Load the model when Django app starts (or first accessed)
# This will happen when the module is imported.
load_chatterbox_model() 

# In a real app, use a database or cache for session management.
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
        
        # Generate a unique ID for this uploaded audio (acting as a 'voice_id' for the session)
        session_voice_id = str(uuid.uuid4())
        TEMP_UPLOADED_VOICES[session_voice_id] = audio_bytes 

        return Response({"voice_id": session_voice_id, "message": "Voice sample uploaded. Ready for synthesis."}, status=status.HTTP_200_OK)

class SpeakView(APIView):
    """
    API endpoint for generating audio from text using a previously uploaded voice.
    This now calls the locally loaded ChatterboxTTS model.
    """
    def post(self, request, *args, **kwargs):
        data = request.data
        voice_id = data.get("voice_id")
        text = data.get("text")
        
        # Parameters from Streamlit frontend
        stability_from_frontend = data.get("stability", 0.5) 
        exaggeration = (1 - stability_from_frontend) * 1.75 + 0.25
        exaggeration = max(0.25, min(2.0, exaggeration)) 

        cfg_weight = data.get("similarity_boost", 0.5) 
        cfg_weight = max(0.0, min(1.0, cfg_weight)) 

        temperature = data.get("temperature", 0.8) 
        seed_num = int(data.get("seed_num", 0)) 

        if not voice_id or not text:
            return Response({"error": "Voice ID and text are required."}, status=status.HTTP_400_BAD_REQUEST)

        uploaded_audio_bytes = TEMP_UPLOADED_VOICES.get(voice_id)
        if uploaded_audio_bytes is None:
            return Response({"error": f"Voice sample with ID '{voice_id}' not found. Please upload voice again."}, status=status.HTTP_404_NOT_FOUND)

        try:
            # Call the local ChatterboxTTS generation function
            generated_audio_bytes = generate_audio_with_chatterbox(
                text=text,
                audio_file_bytes=uploaded_audio_bytes,
                exaggeration=exaggeration,
                temperature=temperature,
                seed_num=seed_num,
                cfg_weight=cfg_weight
            )
            
            # --- THE CRUCIAL CHANGE IS HERE ---
            # Instead of DRF's Response, use Django's native HttpResponse.
            # This directly sets the response body to your binary audio data
            # with the specified content type, bypassing JSON serialization.
            return HttpResponse(generated_audio_bytes, content_type='audio/wav', status=status.HTTP_200_OK)
            # --- END OF CHANGE ---

        except Exception as e:
            # Catch exceptions from generate_audio_with_chatterbox and return a proper JSON error
            # For errors, we still want to send JSON so the frontend can parse it.
            return Response({"error": f"Audio generation failed: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)