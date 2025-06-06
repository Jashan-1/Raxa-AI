# # backend/base_app/utils.py

# import os
# import random
# import numpy as np
# import torch
# import torchaudio
# import io
# import threading

# # Assuming ChatterboxTTS is installed and available in your backend's Python environment
# from chatterbox.tts import ChatterboxTTS

# # --- Device Configuration for Apple Silicon (M4) ---
# DEVICE = "mps" if torch.backends.mps.is_available() else "cpu"
# map_location = torch.device(DEVICE) # Define map_location based on the detected device
# print(f"ChatterboxTTS model will use PyTorch device: {DEVICE}")

# # --- Patch torch.load for proper device mapping ---
# # This ensures that when ChatterboxTTS.from_pretrained() (or any other function)
# # internally calls torch.load, it correctly maps CUDA tensors to MPS/CPU.
# torch_load_original = torch.load
# def patched_torch_load(*args, **kwargs):
#     if 'map_location' not in kwargs:
#         kwargs['map_location'] = map_location # Use our detected device
#     return torch_load_original(*args, **kwargs)

# torch.load = patched_torch_load
# # --- End Patch ---


# # Load the model once globally when the Django app starts
# _chatterbox_model = None
# _model_lock = threading.Lock() # To ensure thread-safe model loading

# def load_chatterbox_model():
#     global _chatterbox_model
#     with _model_lock:
#         if _chatterbox_model is None:
#             print(f"Loading ChatterboxTTS model onto {DEVICE}...")
#             _chatterbox_model = ChatterboxTTS.from_pretrained(DEVICE)
#             # REMOVED: _chatterbox_model.to(DEVICE) - This line was causing the AttributeError
#             print("ChatterboxTTS model loaded.")
#         return _chatterbox_model

# def set_seed(seed: int):
#     """Sets random seeds for reproducibility."""
#     torch.manual_seed(seed)
#     # The torch.cuda.is_available() check here is generally fine, but for MPS-only,
#     # it won't execute the CUDA-specific seeds. This is okay.
#     if torch.cuda.is_available(): 
#         torch.cuda.manual_seed(seed)
#         torch.cuda.manual_seed_all(seed)
#     random.seed(seed)
#     np.random.seed(seed)
#     print(f"Random seed set to {seed}")


# # --- Audio Processing Constants ---
# # IMPORTANT: Confirm this sample rate by running the local Gradio code snippet
# # you provided, printing `model.sr` after it loads. Adjust if necessary.
# # Example: print(model.sr) after model = ChatterboxTTS.from_pretrained(DEVICE)
# # I'll use 22050 as a common default, but direct verification is best.
# # This constant is actually not strictly needed if you use model.sr directly as below.
# # CHATTERBOX_MODEL_SAMPLE_RATE = 22050 


# def generate_audio_with_chatterbox(text: str, audio_file_bytes: bytes, 
#                                     exaggeration: float, temperature: float, 
#                                     seed_num: int, cfg_weight: float) -> bytes:
#     """
#     Generates audio using the locally loaded ChatterboxTTS model.
#     Handles audio prompt processing (resampling, converting to WAV).
#     """
#     model = load_chatterbox_model() # Ensure model is loaded

#     if not audio_file_bytes:
#         raise ValueError("Audio file bytes for voice cloning cannot be empty.")
#     if not text:
#         raise ValueError("Text to speak cannot be empty.")

#     temp_audio_path = None # Initialize to None for cleanup in finally block
#     try:
#         # Process incoming audio file (MP3, Opus, etc.) to WAV bytes for Chatterbox
#         audio_io_buffer = io.BytesIO(audio_file_bytes)
#         waveform, sample_rate = torchaudio.load(audio_io_buffer)

#         # Ensure mono audio
#         if waveform.ndim > 1:
#             waveform = torch.mean(waveform, dim=0, keepdim=True)
#         else:
#             waveform = waveform.unsqueeze(0) # Add batch dim (1, samples)

#         # Move waveform to the device for efficient resampling
#         waveform = waveform.to(DEVICE)

#         # Resample if necessary to the model's expected sample rate
#         if sample_rate != model.sr: # Use model.sr for precision
#             print(f"Resampling audio from {sample_rate}Hz to {model.sr}Hz for Chatterbox.")
#             resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=model.sr).to(DEVICE)
#             waveform = resampler(waveform)
#             # sample_rate is already updated by model.sr for subsequent use

#         # Save the processed audio to a temporary WAV file to pass to model.generate
#         # Chatterbox's model.generate expects a path for audio_prompt_path
#         # Use a more robust temporary file name for multi-threaded server
#         temp_audio_path = os.path.join(os.path.dirname(__file__), f'temp_audio_prompt_{os.getpid()}_{threading.get_ident()}.wav')
        
#         # Move waveform to CPU before saving to WAV (best practice for torchaudio.save)
#         torchaudio.save(temp_audio_path, waveform.cpu(), model.sr, format="wav") # Use model.sr here

#     except Exception as e:
#         raise ValueError(f"Error processing input audio for Chatterbox: {e}. "
#                          "Please ensure FFmpeg is installed and accessible, and audio file is valid.")

#     # Set seed if provided
#     if seed_num != 0:
#         set_seed(int(seed_num))

#     try:
#         # Generate audio using the ChatterboxTTS model
#         wav_output_tensor = model.generate(
#             text,
#             audio_prompt_path=temp_audio_path, # Pass the path to the temporary WAV file
#             exaggeration=exaggeration,
#             temperature=temperature,
#             cfg_weight=cfg_weight,
#         )

#         # Convert output tensor to numpy array and then to WAV bytes
#         output_numpy = wav_output_tensor.squeeze(0).cpu().numpy()
        
#         output_audio_io = io.BytesIO()
#         # torchaudio.save expects a tensor, so convert back from numpy temporarily
#         # Ensure the tensor is float and has a batch dimension (1, samples)
#         torchaudio.save(output_audio_io, torch.from_numpy(output_numpy).float().unsqueeze(0), model.sr, format="wav")
        
#         return output_audio_io.getvalue()

#     except Exception as e:
#         raise Exception(f"ChatterboxTTS generation failed: {e}")
#     finally:
#         # Clean up the temporary audio prompt file in all cases
#         if temp_audio_path and os.path.exists(temp_audio_path):
#             os.remove(temp_audio_path)
#             print(f"Cleaned up temporary file: {temp_audio_path}")



# backend/base_app/utils.py

import os
os.environ["PYTORCH_MPS_HIGH_WATERMARK_RATIO"] = "0.0"

import random
import numpy as np
import torch
import torchaudio
import io
import threading
from dotenv import load_dotenv
import openai # New import for OpenAI

# Load environment variables from .env file
load_dotenv()

# Assuming ChatterboxTTS is installed and available in your backend's Python environment
from chatterbox.tts import ChatterboxTTS

# --- Device Configuration for Apple Silicon (M4) ---
DEVICE = "mps" if torch.backends.mps.is_available() else "cpu"
map_location = torch.device(DEVICE) # Define map_location based on the detected device
print(f"ChatterboxTTS model will use PyTorch device: {DEVICE}")

# --- Patch torch.load for proper device mapping ---
# This ensures that when ChatterboxTTS.from_pretrained() (or any other function)
# internally calls torch.load, it correctly maps CUDA tensors to MPS/CPU.
torch_load_original = torch.load
def patched_torch_load(*args, **kwargs):
    if 'map_location' not in kwargs:
        kwargs['map_location'] = map_location # Use our detected device
    return torch_load_original(*args, **kwargs)

torch.load = patched_torch_load
# --- End Patch ---


# Load the model once globally when the Django app starts
_chatterbox_model = None
_model_lock = threading.Lock() # To ensure thread-safe model loading

def load_chatterbox_model():
    global _chatterbox_model
    with _model_lock:
        if _chatterbox_model is None:
            print(f"Loading ChatterboxTTS model onto {DEVICE}...")
            _chatterbox_model = ChatterboxTTS.from_pretrained(DEVICE)
            print("ChatterboxTTS model loaded.")
        return _chatterbox_model

def set_seed(seed: int):
    """Sets random seeds for reproducibility."""
    torch.manual_seed(seed)
    if torch.cuda.is_available(): 
        torch.cuda.manual_seed(seed)
        torch.cuda.manual_seed_all(seed)
    random.seed(seed)
    np.random.seed(seed)
    print(f"Random seed set to {seed}")


def generate_audio_with_chatterbox(text: str, audio_file_bytes: bytes, 
                                    exaggeration: float, temperature: float, 
                                    seed_num: int, cfg_weight: float) -> bytes:
    """
    Generates audio using the locally loaded ChatterboxTTS model.
    Handles audio prompt processing (resampling, converting to WAV).
    """
    model = load_chatterbox_model() # Ensure model is loaded

    if not audio_file_bytes:
        raise ValueError("Audio file bytes for voice cloning cannot be empty.")
    if not text:
        raise ValueError("Text to speak cannot be empty.")

    temp_audio_path = None # Initialize to None for cleanup in finally block
    try:
        # Process incoming audio file (MP3, Opus, etc.) to WAV bytes for Chatterbox
        audio_io_buffer = io.BytesIO(audio_file_bytes)
        waveform, sample_rate = torchaudio.load(audio_io_buffer)

        # Ensure mono audio
        if waveform.ndim > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)
        else:
            waveform = waveform.unsqueeze(0) # Add batch dim (1, samples)

        # Move waveform to the device for efficient resampling
        waveform = waveform.to(DEVICE)

        # Resample if necessary to the model's expected sample rate
        if sample_rate != model.sr: # Use model.sr for precision
            print(f"Resampling audio from {sample_rate}Hz to {model.sr}Hz for Chatterbox.")
            resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=model.sr).to(DEVICE)
            waveform = resampler(waveform)

        temp_audio_path = os.path.join(os.path.dirname(__file__), f'temp_audio_prompt_{os.getpid()}_{threading.get_ident()}.wav')
        
        torchaudio.save(temp_audio_path, waveform.cpu(), model.sr, format="wav") # Use model.sr here

    except Exception as e:
        raise ValueError(f"Error processing input audio for Chatterbox: {e}. "
                         "Please ensure FFmpeg is installed and accessible, and audio file is valid.")

    # Set seed if provided
    if seed_num != 0:
        set_seed(int(seed_num))

    try:
        # Generate audio using the ChatterboxTTS model
        wav_output_tensor = model.generate(
            text,
            audio_prompt_path=temp_audio_path, # Pass the path to the temporary WAV file
            exaggeration=exaggeration,
            temperature=temperature,
            cfg_weight=cfg_weight,
        )

        output_numpy = wav_output_tensor.squeeze(0).cpu().numpy()
        
        output_audio_io = io.BytesIO()
        torchaudio.save(output_audio_io, torch.from_numpy(output_numpy).float().unsqueeze(0), model.sr, format="wav")
        
        return output_audio_io.getvalue()

    except Exception as e:
        raise Exception(f"ChatterboxTTS generation failed: {e}")
    finally:
        # Clean up the temporary audio prompt file in all cases
        if temp_audio_path and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)
            print(f"Cleaned up temporary file: {temp_audio_path}")


# --- OpenAI API Configuration ---
# Ensure you have OPENAI_API_KEY set in your environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

# Language mapping for better translation prompts
LANGUAGE_CODES = {
    "English": "en",
    "Spanish": "es", 
    "French": "fr",
    "German": "de",
    "Hindi": "hi",
    "Punjabi": "pa",
    "Japanese": "ja",
    "Chinese": "zh"
}

def generate_script_with_openai(prompt: str, language: str) -> str:
    """
    Enhanced with transliteration support for non-English languages
    """
    if not openai.api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set.")

    try:
        if language.lower() == "english":
            # Generate directly in English
            system_message = (
                "You are a professional script writer. Generate a clear, engaging script for podcast or video content "
                "based on the user's prompt. Make it natural-sounding and suitable for text-to-speech synthesis. "
                "Keep sentences moderate in length and avoid complex punctuation that might confuse TTS systems. "
                "Focus on creating content that flows well when spoken aloud. "
                "Return ONLY the final script without any labels, headers, or explanations."
            )
            user_message = f"Generate a script based on this prompt: '{prompt}'."
        else:
            # Generate transliterated version for TTS compatibility
            system_message = (
                f"You are a professional script writer. Generate a script for podcast or video content "
                f"that represents {language} speech but written in English/Roman letters (transliterated). "
                f"This means writing {language} words using English alphabet so they can be pronounced correctly by English TTS. "
                f"For example: Hindi 'नमस्कार' becomes 'namaste', 'दोस्तों' becomes 'doston', etc. "
                f"Make it natural-sounding and suitable for text-to-speech synthesis. "
                f"Keep sentences moderate in length and use simple punctuation. "
                f"The goal is that when an English TTS reads this, it sounds like natural {language} speech. "
                f"Return ONLY the transliterated script without any labels, headers, or explanations."
            )
            user_message = (
                f"Generate a script in {language} but write it using English/Roman letters (transliterated) "
                f"based on this prompt: '{prompt}'. Make sure the transliteration sounds natural when spoken by English TTS."
            )

        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message},
            ],
            max_tokens=600,
            temperature=0.7
        )
        
        script = response.choices[0].message.content.strip()
        
        # Clean up any markdown or formatting
        script = script.replace("**", "").replace("*", "").replace("#", "")
        
        # Remove any section headers that might have slipped through
        lines = script.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            if (line.lower().startswith(('script:', 'transliteration:', '---')) 
                or line == '---' 
                or not line):
                continue
            cleaned_lines.append(line)
        
        final_script = '\n'.join(cleaned_lines).strip()
        return final_script
        
    except openai.APIError as e:
        raise Exception(f"OpenAI API error: {e}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred during script generation: {e}")



def generate_complete_workflow(prompt: str, language: str, audio_file_bytes: bytes,
                             exaggeration: float, temperature: float, 
                             seed_num: int, cfg_weight: float) -> tuple[str, bytes]:
    """
    Complete workflow: Generate script -> Translate -> Generate audio
    Returns: (generated_script, audio_bytes)
    """
    try:
        # Step 1: Generate and translate script
        script = generate_script_with_openai(prompt, language)
        
        # Step 2: Generate audio with the translated script
        audio_bytes = generate_audio_with_chatterbox(
            text=script,
            audio_file_bytes=audio_file_bytes,
            exaggeration=exaggeration,
            temperature=temperature,
            seed_num=seed_num,
            cfg_weight=cfg_weight
        )
        
        return script, audio_bytes
        
    except Exception as e:
        raise Exception(f"Complete workflow failed: {e}")