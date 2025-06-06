# import streamlit as st
# import requests
# import os
# import io

# # --- Configuration ---
# BACKEND_URL = "http://localhost:8000/api/" # Ensure this matches your Django backend URL

# # --- Page Functions ---

# def home_page():
#     st.title("Welcome to the AI Ad Generator!")
#     st.write("This application allows you to create AI-generated short video ads using your own voice.")
#     st.write("Explore the navigation on the left to get started:")
#     st.markdown("- **Voice Cloning Test:** Upload your voice sample and test the voice cloning functionality.")
#     st.markdown("- **Generate Ad (WIP):** (Work in Progress) This section will allow you to generate full ads.")

#     st.image("https://via.placeholder.com/600x300?text=AI+Ad+Generator+Banner", caption="Automated Ads with Your Voice!", use_container_width=True)
#     st.markdown("---")
#     st.write("Current Backend Status: Connected to " + BACKEND_URL)


# def voice_cloning_test_page():
#     st.title("🗣️ Voice Cloning Test")
#     st.write("Upload a short audio sample of your voice (around 5-10 seconds recommended) to clone it.")
#     st.write("Then, type some text to hear your cloned voice.")

#     # State to store the cloned voice ID
#     if 'cloned_voice_id' not in st.session_state:
#         st.session_state.cloned_voice_id = None

#     # --- Step 1: Upload Voice Sample ---
#     st.subheader("1. Upload Your Voice Sample (.wav, .mp3, or .opus)")
#     # ADD 'opus' to the accepted types
#     uploaded_file = st.file_uploader("Choose an audio file", type=["wav", "mp3", "opus"])

#     if uploaded_file is not None:
#         st.audio(uploaded_file, format=uploaded_file.type)
#         st.write(f"File uploaded: {uploaded_file.name} ({round(uploaded_file.size / 1024 / 1024, 2)} MB)")

#         if st.button("Clone My Voice", key="clone_button"):
#             with st.spinner("Cloning voice... This might take a moment."):
#                 # Ensure the correct content type is sent for Opus if needed, though requests usually handles it
#                 files = {'audio_file': (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
#                 try:
#                     response = requests.post(f"{BACKEND_URL}voice_clone/", files=files)
#                     if response.status_code == 200:
#                         data = response.json()
#                         st.session_state.cloned_voice_id = data.get("voice_id")
#                         st.success(f"Voice cloned successfully! Voice ID: `{st.session_state.cloned_voice_id}`")
#                         st.info("Now, proceed to type text and test your cloned voice.")
#                     else:
#                         st.error(f"Error cloning voice: {response.status_code} - {response.text}")
#                         st.session_state.cloned_voice_id = None
#                 except requests.exceptions.ConnectionError:
#                     st.error(f"Could not connect to backend at {BACKEND_URL}. Please ensure the Django server is running.")
#                 except Exception as e:
#                     st.error(f"An unexpected error occurred during voice cloning: {e}")

#     # --- Step 2: Test Cloned Voice ---
#     st.subheader("2. Test Your Cloned Voice")
#     if st.session_state.cloned_voice_id:
#         text_to_speak = st.text_area("Enter text to speak:", "Hello, this is my cloned voice. I can now generate ads for you!", height=100)
#         stability = st.slider("Voice Stability", 0.0, 1.0, 0.75, 0.05, help="Controls consistency of cloned voice. Lower values can sound more expressive, higher more stable.")
#         similarity_boost = st.slider("Similarity Boost", 0.0, 1.0, 0.75, 0.05, help="Boosts how closely the voice matches the original sample. Higher values can reduce naturalness.")
        
#         if st.button("Speak with Cloned Voice", key="speak_button"):
#             if not text_to_speak.strip():
#                 st.warning("Please enter some text to speak.")
#                 return

#             with st.spinner("Generating audio..."):
#                 payload = {
#                     "voice_id": st.session_state.cloned_voice_id,
#                     "text": text_to_speak,
#                     "stability": stability,
#                     "similarity_boost": similarity_boost
#                 }
#                 headers = {'Content-Type': 'application/json'}
#                 try:
#                     response = requests.post(f"{BACKEND_URL}speak/", json=payload, headers=headers)
#                     if response.status_code == 200:
#                         audio_data = response.content
#                         st.audio(audio_data, format='audio/wav') # Still outputting WAV for broad compatibility
#                         st.success("Audio generated!")
#                     else:
#                         st.error(f"Error generating audio: {response.status_code} - {response.text}")
#                 except requests.exceptions.ConnectionError:
#                     st.error(f"Could not connect to backend at {BACKEND_URL}. Please ensure the Django server is running.")
#                 except Exception as e:
#                     st.error(f"An unexpected error occurred during audio generation: {e}")
#     else:
#         st.info("Please upload a voice sample and click 'Clone My Voice' first.")


# def generate_ad_page():
#     st.title("🎬 Generate Your Ad (Work in Progress)")
#     st.write("This section will allow you to generate full AI-powered video ads.")
#     st.write("Here, you'll be able to:")
#     st.markdown("- Provide a detailed prompt for your ad.")
#     st.markdown("- Choose ad type, tone, and target audience.")
#     st.markdown("- See a preview of your generated ad.")
#     st.markdown("- Download or prepare for social media posting.")

#     st.info("Stay tuned! This functionality will be developed in the next phases.")


# # --- Main App Logic ---
# def main():
#     st.sidebar.title("Navigation")
#     selection = st.sidebar.radio("Go to", ["Home", "Voice Cloning Test", "Generate Ad (WIP)"])

#     if selection == "Home":
#         home_page()
#     elif selection == "Voice Cloning Test":
#         voice_cloning_test_page()
#     elif selection == "Generate Ad (WIP)":
#         generate_ad_page()

#     # Add some general styling or info if needed
#     st.sidebar.markdown("---")
#     st.sidebar.info("This is an AI-powered ad generation tool. Built with Streamlit, Django, and open-source AI models.")

# if __name__ == "__main__":
#     main()




# frontend/app.py

import streamlit as st
import requests
import io
import soundfile as sf # For playing audio

# --- Backend API Endpoint ---
# Point to your Django backend
BACKEND_URL = "http://localhost:8000/api"

st.set_page_config(page_title="Chatterbox Voice Cloning", layout="centered")

st.title("🗣️ Chatterbox Voice Cloning (Local)")
st.markdown("Upload a voice sample, provide text, and generate speech in the cloned voice.")

# --- Voice Cloning Section ---
st.subheader("1. Clone a Voice")
uploaded_file = st.file_uploader(
    "Upload a short (3-10 second) audio clip of the voice you want to clone (.wav, .mp3, .opus)",
    type=["wav", "mp3", "opus"]
)

voice_id = st.session_state.get('voice_id', None)
cloned_voice_message = st.empty()

if uploaded_file is not None:
    # Read the file as bytes
    audio_bytes = uploaded_file.read()
    
    # Send to Django backend for processing and storing
    files = {'audio_file': (uploaded_file.name, audio_bytes, uploaded_file.type)}
    
    with st.spinner("Cloning voice..."):
        try:
            response = requests.post(f"{BACKEND_URL}/voice_clone/", files=files)
            if response.status_code == 200:
                result = response.json()
                st.session_state['voice_id'] = result['voice_id']
                cloned_voice_message.success(result['message'])
            else:
                cloned_voice_message.error(f"Failed to clone voice: {response.json().get('error', 'Unknown error')}")
                st.session_state['voice_id'] = None
        except requests.exceptions.ConnectionError:
            cloned_voice_message.error("Could not connect to the backend. Is it running?")
            st.session_state['voice_id'] = None
        except Exception as e:
            cloned_voice_message.error(f"An unexpected error occurred during voice cloning: {e}")
            st.session_state['voice_id'] = None
else:
    st.session_state['voice_id'] = None
    cloned_voice_message.info("Please upload an audio file to clone a voice.")


# --- Text-to-Speech Section ---
st.subheader("2. Generate Speech")

text_input = st.text_area(
    "Enter text to generate speech:",
    "Now let's make my mum's favourite. So three mars bars into the pan. Then we add the tuna and just stir for a bit, just let the chocolate and fish infuse. A sprinkle of olive oil and some tomato ketchup. Now smell that. Oh boy this is going to be incredible.",
    height=150,
    max_chars=300
)

# Sliders for Chatterbox model parameters (matching Gradio app)
exaggeration = st.slider("Exaggeration (0.25 = Neutral, 2 = Extreme)", min_value=0.25, max_value=2.0, value=0.5, step=0.05)
cfg_weight = st.slider("CFG/Pace (0.0 = Default, 1.0 = More adherence)", min_value=0.0, max_value=1.0, value=0.5, step=0.05)
temperature = st.slider("Temperature (Higher = more varied, potentially less stable)", min_value=0.05, max_value=5.0, value=0.8, step=0.05)
seed_num = st.number_input("Random Seed (0 for random)", min_value=0, value=0, step=1)


generate_button = st.button("Generate Audio", type="primary", disabled=(voice_id is None))

if generate_button:
    if voice_id is None:
        st.error("Please upload a voice sample first.")
    elif not text_input:
        st.error("Please enter text to generate speech.")
    else:
        with st.spinner("Generating audio..."):
            try:
                payload = {
                    "voice_id": voice_id,
                    "text": text_input,
                    "exaggeration": exaggeration, # Now directly passed
                    "cfg_weight": cfg_weight,     # Now directly passed
                    "temperature": temperature,   # New parameter
                    "seed_num": seed_num          # New parameter
                }
                
                response = requests.post(f"{BACKEND_URL}/speak/", json=payload)
                
                if response.status_code == 200:
                    audio_data = response.content # Raw WAV bytes
                    st.audio(audio_data, format='audio/wav') # Streamlit can play WAV bytes
                    st.success("Audio generated successfully!")
                else:
                    error_detail = response.json().get('error', 'Unknown error during audio generation.')
                    st.error(f"Error generating audio: {response.status_code} - {error_detail}")
            except requests.exceptions.ConnectionError:
                st.error("Could not connect to the backend. Is it running?")
            except Exception as e:
                st.error(f"An unexpected error occurred during audio generation: {e}")