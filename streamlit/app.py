# # import streamlit as st
# # import requests
# # import os
# # import io

# # # --- Configuration ---
# # BACKEND_URL = "http://localhost:8000/api/" # Ensure this matches your Django backend URL

# # # --- Page Functions ---

# # def home_page():
# #     st.title("Welcome to the AI Ad Generator!")
# #     st.write("This application allows you to create AI-generated short video ads using your own voice.")
# #     st.write("Explore the navigation on the left to get started:")
# #     st.markdown("- **Voice Cloning Test:** Upload your voice sample and test the voice cloning functionality.")
# #     st.markdown("- **Generate Ad (WIP):** (Work in Progress) This section will allow you to generate full ads.")

# #     st.image("https://via.placeholder.com/600x300?text=AI+Ad+Generator+Banner", caption="Automated Ads with Your Voice!", use_container_width=True)
# #     st.markdown("---")
# #     st.write("Current Backend Status: Connected to " + BACKEND_URL)


# # def voice_cloning_test_page():
# #     st.title("🗣️ Voice Cloning Test")
# #     st.write("Upload a short audio sample of your voice (around 5-10 seconds recommended) to clone it.")
# #     st.write("Then, type some text to hear your cloned voice.")

# #     # State to store the cloned voice ID
# #     if 'cloned_voice_id' not in st.session_state:
# #         st.session_state.cloned_voice_id = None

# #     # --- Step 1: Upload Voice Sample ---
# #     st.subheader("1. Upload Your Voice Sample (.wav, .mp3, or .opus)")
# #     # ADD 'opus' to the accepted types
# #     uploaded_file = st.file_uploader("Choose an audio file", type=["wav", "mp3", "opus"])

# #     if uploaded_file is not None:
# #         st.audio(uploaded_file, format=uploaded_file.type)
# #         st.write(f"File uploaded: {uploaded_file.name} ({round(uploaded_file.size / 1024 / 1024, 2)} MB)")

# #         if st.button("Clone My Voice", key="clone_button"):
# #             with st.spinner("Cloning voice... This might take a moment."):
# #                 # Ensure the correct content type is sent for Opus if needed, though requests usually handles it
# #                 files = {'audio_file': (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
# #                 try:
# #                     response = requests.post(f"{BACKEND_URL}voice_clone/", files=files)
# #                     if response.status_code == 200:
# #                         data = response.json()
# #                         st.session_state.cloned_voice_id = data.get("voice_id")
# #                         st.success(f"Voice cloned successfully! Voice ID: `{st.session_state.cloned_voice_id}`")
# #                         st.info("Now, proceed to type text and test your cloned voice.")
# #                     else:
# #                         st.error(f"Error cloning voice: {response.status_code} - {response.text}")
# #                         st.session_state.cloned_voice_id = None
# #                 except requests.exceptions.ConnectionError:
# #                     st.error(f"Could not connect to backend at {BACKEND_URL}. Please ensure the Django server is running.")
# #                 except Exception as e:
# #                     st.error(f"An unexpected error occurred during voice cloning: {e}")

# #     # --- Step 2: Test Cloned Voice ---
# #     st.subheader("2. Test Your Cloned Voice")
# #     if st.session_state.cloned_voice_id:
# #         text_to_speak = st.text_area("Enter text to speak:", "Hello, this is my cloned voice. I can now generate ads for you!", height=100)
# #         stability = st.slider("Voice Stability", 0.0, 1.0, 0.75, 0.05, help="Controls consistency of cloned voice. Lower values can sound more expressive, higher more stable.")
# #         similarity_boost = st.slider("Similarity Boost", 0.0, 1.0, 0.75, 0.05, help="Boosts how closely the voice matches the original sample. Higher values can reduce naturalness.")
        
# #         if st.button("Speak with Cloned Voice", key="speak_button"):
# #             if not text_to_speak.strip():
# #                 st.warning("Please enter some text to speak.")
# #                 return

# #             with st.spinner("Generating audio..."):
# #                 payload = {
# #                     "voice_id": st.session_state.cloned_voice_id,
# #                     "text": text_to_speak,
# #                     "stability": stability,
# #                     "similarity_boost": similarity_boost
# #                 }
# #                 headers = {'Content-Type': 'application/json'}
# #                 try:
# #                     response = requests.post(f"{BACKEND_URL}speak/", json=payload, headers=headers)
# #                     if response.status_code == 200:
# #                         audio_data = response.content
# #                         st.audio(audio_data, format='audio/wav') # Still outputting WAV for broad compatibility
# #                         st.success("Audio generated!")
# #                     else:
# #                         st.error(f"Error generating audio: {response.status_code} - {response.text}")
# #                 except requests.exceptions.ConnectionError:
# #                     st.error(f"Could not connect to backend at {BACKEND_URL}. Please ensure the Django server is running.")
# #                 except Exception as e:
# #                     st.error(f"An unexpected error occurred during audio generation: {e}")
# #     else:
# #         st.info("Please upload a voice sample and click 'Clone My Voice' first.")


# # def generate_ad_page():
# #     st.title("🎬 Generate Your Ad (Work in Progress)")
# #     st.write("This section will allow you to generate full AI-powered video ads.")
# #     st.write("Here, you'll be able to:")
# #     st.markdown("- Provide a detailed prompt for your ad.")
# #     st.markdown("- Choose ad type, tone, and target audience.")
# #     st.markdown("- See a preview of your generated ad.")
# #     st.markdown("- Download or prepare for social media posting.")

# #     st.info("Stay tuned! This functionality will be developed in the next phases.")


# # # --- Main App Logic ---
# # def main():
# #     st.sidebar.title("Navigation")
# #     selection = st.sidebar.radio("Go to", ["Home", "Voice Cloning Test", "Generate Ad (WIP)"])

# #     if selection == "Home":
# #         home_page()
# #     elif selection == "Voice Cloning Test":
# #         voice_cloning_test_page()
# #     elif selection == "Generate Ad (WIP)":
# #         generate_ad_page()

# #     # Add some general styling or info if needed
# #     st.sidebar.markdown("---")
# #     st.sidebar.info("This is an AI-powered ad generation tool. Built with Streamlit, Django, and open-source AI models.")

# # if __name__ == "__main__":
# #     main()




# # frontend/app.py

# import streamlit as st
# import requests
# import io
# import soundfile as sf # For playing audio

# # --- Backend API Endpoint ---
# # Point to your Django backend
# BACKEND_URL = "http://localhost:8000/api"

# st.set_page_config(page_title="Chatterbox Voice Cloning", layout="centered")

# st.title("🗣️ Chatterbox Voice Cloning (Local)")
# st.markdown("Upload a voice sample, provide text, and generate speech in the cloned voice.")

# # --- Voice Cloning Section ---
# st.subheader("1. Clone a Voice")
# uploaded_file = st.file_uploader(
#     "Upload a short (3-10 second) audio clip of the voice you want to clone (.wav, .mp3, .opus)",
#     type=["wav", "mp3", "opus"]
# )

# voice_id = st.session_state.get('voice_id', None)
# cloned_voice_message = st.empty()

# if uploaded_file is not None:
#     # Read the file as bytes
#     audio_bytes = uploaded_file.read()
    
#     # Send to Django backend for processing and storing
#     files = {'audio_file': (uploaded_file.name, audio_bytes, uploaded_file.type)}
    
#     with st.spinner("Cloning voice..."):
#         try:
#             response = requests.post(f"{BACKEND_URL}/voice_clone/", files=files)
#             if response.status_code == 200:
#                 result = response.json()
#                 st.session_state['voice_id'] = result['voice_id']
#                 cloned_voice_message.success(result['message'])
#             else:
#                 cloned_voice_message.error(f"Failed to clone voice: {response.json().get('error', 'Unknown error')}")
#                 st.session_state['voice_id'] = None
#         except requests.exceptions.ConnectionError:
#             cloned_voice_message.error("Could not connect to the backend. Is it running?")
#             st.session_state['voice_id'] = None
#         except Exception as e:
#             cloned_voice_message.error(f"An unexpected error occurred during voice cloning: {e}")
#             st.session_state['voice_id'] = None
# else:
#     st.session_state['voice_id'] = None
#     cloned_voice_message.info("Please upload an audio file to clone a voice.")


# # --- Text-to-Speech Section ---
# st.subheader("2. Generate Speech")

# text_input = st.text_area(
#     "Enter text to generate speech:",
#     "Now let's make my mum's favourite. So three mars bars into the pan. Then we add the tuna and just stir for a bit, just let the chocolate and fish infuse. A sprinkle of olive oil and some tomato ketchup. Now smell that. Oh boy this is going to be incredible.",
#     height=150,
#     max_chars=300
# )

# # Sliders for Chatterbox model parameters (matching Gradio app)
# exaggeration = st.slider("Exaggeration (0.25 = Neutral, 2 = Extreme)", min_value=0.25, max_value=2.0, value=0.5, step=0.05)
# cfg_weight = st.slider("CFG/Pace (0.0 = Default, 1.0 = More adherence)", min_value=0.0, max_value=1.0, value=0.5, step=0.05)
# temperature = st.slider("Temperature (Higher = more varied, potentially less stable)", min_value=0.05, max_value=5.0, value=0.8, step=0.05)
# seed_num = st.number_input("Random Seed (0 for random)", min_value=0, value=0, step=1)


# generate_button = st.button("Generate Audio", type="primary", disabled=(voice_id is None))

# if generate_button:
#     if voice_id is None:
#         st.error("Please upload a voice sample first.")
#     elif not text_input:
#         st.error("Please enter text to generate speech.")
#     else:
#         with st.spinner("Generating audio..."):
#             try:
#                 payload = {
#                     "voice_id": voice_id,
#                     "text": text_input,
#                     "exaggeration": exaggeration, # Now directly passed
#                     "cfg_weight": cfg_weight,     # Now directly passed
#                     "temperature": temperature,   # New parameter
#                     "seed_num": seed_num          # New parameter
#                 }
                
#                 response = requests.post(f"{BACKEND_URL}/speak/", json=payload)
                
#                 if response.status_code == 200:
#                     audio_data = response.content # Raw WAV bytes
#                     st.audio(audio_data, format='audio/wav') # Streamlit can play WAV bytes
#                     st.success("Audio generated successfully!")
#                 else:
#                     error_detail = response.json().get('error', 'Unknown error during audio generation.')
#                     st.error(f"Error generating audio: {response.status_code} - {error_detail}")
#             except requests.exceptions.ConnectionError:
#                 st.error("Could not connect to the backend. Is it running?")
#             except Exception as e:
#                 st.error(f"An unexpected error occurred during audio generation: {e}")



# frontend/app.py

# frontend/app.py

# import streamlit as st
# import requests
# import io
# import base64
# import datetime

# # --- Backend API Endpoint ---
# BACKEND_URL = "http://localhost:8000/api"

# st.set_page_config(page_title="Chatterbox Voice Cloning & Script Generation", layout="wide")

# st.title("🗣️ Chatterbox Voice Cloning & Script Generation")
# st.markdown("Upload a voice sample, generate a script in any language, and create speech with the cloned voice.")

# # Create columns for better layout
# col1, col2 = st.columns([1, 1])

# with col1:
#     # --- Voice Cloning Section ---
#     st.subheader("1. 🎤 Clone a Voice")
#     uploaded_file = st.file_uploader(
#         "Upload a short (3-10 second) audio clip of the voice you want to clone",
#         type=["wav", "mp3", "opus", "m4a"],
#         help="Clear, high-quality audio works best. Avoid background noise."
#     )

#     voice_id = st.session_state.get('voice_id', None)
#     cloned_voice_message = st.empty()

#     if uploaded_file is not None:
#         # Show audio file info
#         st.info(f"📁 File: {uploaded_file.name} ({uploaded_file.size} bytes)")
        
#         # Play the uploaded audio for preview
#         st.audio(uploaded_file.getvalue(), format='audio/wav')
        
#         audio_bytes = uploaded_file.read()
#         files = {'audio_file': (uploaded_file.name, audio_bytes, uploaded_file.type)}
        
#         with st.spinner("🔄 Cloning voice..."):
#             try:
#                 response = requests.post(f"{BACKEND_URL}/voice_clone/", files=files)
#                 if response.status_code == 200:
#                     result = response.json()
#                     st.session_state['voice_id'] = result['voice_id']
#                     cloned_voice_message.success(f"✅ {result['message']}")
#                 else:
#                     cloned_voice_message.error(f"❌ Failed to clone voice: {response.json().get('error', 'Unknown error')}")
#                     st.session_state['voice_id'] = None
#             except requests.exceptions.ConnectionError:
#                 cloned_voice_message.error("🔌 Could not connect to the backend. Is it running on port 8000?")
#                 st.session_state['voice_id'] = None
#             except Exception as e:
#                 cloned_voice_message.error(f"❌ An unexpected error occurred: {e}")
#     else:
#         st.session_state['voice_id'] = None
#         cloned_voice_message.info("📤 Please upload an audio file to clone a voice.")

# with col2:
#     # --- Script Generation Section ---
#     st.subheader("2. ✍️ Generate Script")
    
#     script_prompt = st.text_area(
#         "Enter a prompt for your script:",
#         height=100,
#         placeholder="e.g., 'a short podcast introduction about AI trends', 'a video ad for a new coffee machine', 'a motivational speech for students'"
#     )

#     target_language = st.selectbox(
#     "🌍 Select target language:",
#     ("English", "Spanish", "French", "German", "Hindi", "Punjabi", "Japanese", "Chinese"),
#     help="The script will be generated and translated to this language"
#     )

#     # Add transliteration info for non-English languages
#     if target_language.lower() != "english":
#         st.info(f"🔤 **Transliteration Mode**: The script will be generated in {target_language} but written using English letters for TTS compatibility.")
#         st.markdown("**Example**: Hindi 'नमस्कार दोस्तों' becomes 'namaste doston'")


#     generated_script_display = st.empty()
    
#     col_gen, col_workflow = st.columns([1, 1])
    
#     with col_gen:
#         generate_script_button = st.button("📝 Generate Script Only", disabled=not script_prompt.strip())
    
#     with col_workflow:
#         complete_workflow_button = st.button(
#             "🚀 Complete Workflow", 
#             disabled=(not script_prompt.strip() or voice_id is None),
#             help="Generate script + audio in one step",
#             type="primary"
#         )

#     # Generate Script Only
#     if generate_script_button and script_prompt.strip():
#         with st.spinner(f"🤖 Generating script in {target_language}..."):
#             try:
#                 response = requests.post(
#                     f"{BACKEND_URL}/generate_script/",
#                     json={"prompt": script_prompt, "language": target_language}
#                 )
#                 if response.status_code == 200:
#                     result = response.json()
#                     generated_script = result.get("script")
#                     st.session_state['generated_script'] = generated_script
#                     st.session_state['speech_text_area'] = generated_script
                    
#                     generated_script_display.success("✅ Script generated successfully!")
                    
#                     # Show script stats
#                     word_count = result.get("word_count", 0)
#                     char_count = result.get("character_count", 0)
#                     st.info(f"📊 Generated script: {word_count} words, {char_count} characters")
                    
#                 else:
#                     generated_script_display.error(f"❌ Error generating script: {response.json().get('error', 'Unknown error')}")
#                     st.session_state['generated_script'] = None
#             except requests.exceptions.ConnectionError:
#                 generated_script_display.error("🔌 Could not connect to the backend.")
#             except Exception as e:
#                 generated_script_display.error(f"❌ An unexpected error occurred: {e}")

#     # Complete Workflow
#     if complete_workflow_button and script_prompt.strip() and voice_id:
#         with st.spinner(f"🚀 Running complete workflow: Script generation + Translation + Audio synthesis..."):
#             try:
#                 payload = {
#                     "voice_id": voice_id,
#                     "prompt": script_prompt,
#                     "language": target_language,
#                     "exaggeration": st.session_state.get('exaggeration', 0.5),
#                     "cfg_weight": st.session_state.get('cfg_weight', 0.5),
#                     "temperature": st.session_state.get('temperature', 0.8),
#                     "seed_num": st.session_state.get('seed_num', 0),
#                     "download": False
#                 }
                
#                 response = requests.post(f"{BACKEND_URL}/complete_workflow/", json=payload)
                
#                 if response.status_code == 200:
#                     result = response.json()
#                     generated_script = result.get("script")
#                     audio_b64 = result.get("audio_base64")
                    
#                     st.session_state['generated_script'] = generated_script
#                     st.session_state['speech_text_area'] = generated_script
#                     st.session_state['last_audio_b64'] = audio_b64
                    
#                     st.success("🎉 Complete workflow completed successfully!")
                    
#                     # Show script stats
#                     word_count = result.get("word_count", 0)
#                     st.info(f"📊 Generated: {word_count} words in {target_language}")
                    
#                     # Auto-scroll to audio section
#                     st.session_state['show_audio'] = True
                    
#                 else:
#                     st.error(f"❌ Workflow failed: {response.json().get('error', 'Unknown error')}")
                    
#             except requests.exceptions.ConnectionError:
#                 st.error("🔌 Could not connect to the backend.")
#             except Exception as e:
#                 st.error(f"❌ Workflow error: {e}")

# # --- Display Generated Script ---
# if st.session_state.get('generated_script'):
#     st.subheader(f"📄 Generated Script ({target_language})")
    
#     # Make script editable
#     edited_script = st.text_area(
#         "Review and edit the script:",
#         value=st.session_state['generated_script'],
#         height=200,
#         key="final_script_input"
#     )
    
#     if edited_script != st.session_state.get('speech_text_area', ''):
#         st.session_state['speech_text_area'] = edited_script

# # --- Audio Generation Section ---
# st.subheader("3. 🔊 Generate Speech with Cloned Voice")

# # Advanced parameters in an expander
# with st.expander("🎛️ Advanced Audio Parameters"):
#     col_param1, col_param2 = st.columns(2)
    
#     with col_param1:
#         exaggeration = st.slider(
#             "Exaggeration", 
#             min_value=0.25, max_value=2.0, value=0.5, step=0.05,
#             help="0.25 = Neutral, 2.0 = Extreme expression"
#         )
#         st.session_state['exaggeration'] = exaggeration
        
#         temperature = st.slider(
#             "Temperature", 
#             min_value=0.05, max_value=5.0, value=0.8, step=0.05,
#             help="Higher = more varied, potentially less stable"
#         )
#         st.session_state['temperature'] = temperature
    
#     with col_param2:
#         cfg_weight = st.slider(
#             "CFG/Pace", 
#             min_value=0.0, max_value=1.0, value=0.5, step=0.05,
#             help="0.0 = Default, 1.0 = More adherence to prompt"
#         )
#         st.session_state['cfg_weight'] = cfg_weight
        
#         seed_num = st.number_input(
#             "Random Seed", 
#             min_value=0, value=0, step=1,
#             help="0 for random, same number for reproducible results"
#         )
#         st.session_state['seed_num'] = seed_num

# # Text input for speech
# text_to_speak = st.text_area(
#     "Enter text to speak:",
#     value=st.session_state.get('speech_text_area', ''),
#     height=120,
#     key="speech_text_area",
#     placeholder="Enter your text here or use the generated script above..."
# )

# # Audio generation buttons
# col_audio1, col_audio2 = st.columns([1, 1])

# with col_audio1:
#     generate_audio_button = st.button(
#         "🎵 Generate Audio",
#         disabled=(voice_id is None or not text_to_speak.strip()),
#         help="Generate audio for preview"
#     )

# with col_audio2:
#     download_audio_button = st.button(
#         "💾 Generate & Download",
#         disabled=(voice_id is None or not text_to_speak.strip()),
#         help="Generate audio and download as WAV file",
#         type="secondary"
#     )

# # Status messages
# if voice_id is None:
#     st.warning("⚠️ Please upload a voice sample first.")
# elif not text_to_speak.strip():
#     st.warning("⚠️ Please enter text to generate speech.")

# # Generate Audio for Preview
# if generate_audio_button:
#     with st.spinner("🎵 Generating audio..."):
#         try:
#             payload = {
#                 "voice_id": voice_id,
#                 "text": text_to_speak,
#                 "exaggeration": exaggeration,
#                 "cfg_weight": cfg_weight,
#                 "temperature": temperature,
#                 "seed_num": seed_num,
#                 "language": target_language
#             }
            
#             response = requests.post(f"{BACKEND_URL}/speak/", json=payload)
            
#             if response.status_code == 200:
#                 audio_data = response.content
#                 st.audio(audio_data, format='audio/wav')
#                 st.success("✅ Audio generated successfully!")
                
#                 # Store for potential download
#                 st.session_state['last_generated_audio'] = audio_data
                
#             else:
#                 error_detail = response.json().get('error', 'Unknown error')
#                 st.error(f"❌ Error generating audio: {error_detail}")
#         except requests.exceptions.ConnectionError:
#             st.error("🔌 Could not connect to the backend.")
#         except Exception as e:
#             st.error(f"❌ An unexpected error occurred: {e}")

# # Generate and Download Audio
# if download_audio_button:
#     with st.spinner("💾 Generating audio for download..."):
#         try:
#             payload = {
#                 "voice_id": voice_id,
#                 "text": text_to_speak,
#                 "exaggeration": exaggeration,
#                 "cfg_weight": cfg_weight,
#                 "temperature": temperature,
#                 "seed_num": seed_num,
#                 "language": target_language
#             }
            
#             response = requests.post(f"{BACKEND_URL}/download_audio/", json=payload)
            
#             if response.status_code == 200:
#                 audio_data = response.content
                
#                 # Create download link
#                 timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
#                 safe_language = target_language.replace(" ", "_").lower()
#                 filename = f"cloned_voice_{safe_language}_{timestamp}.wav"
                
#                 st.download_button(
#                     label="📥 Download Audio File",
#                     data=audio_data,
#                     file_name=filename,
#                     mime="audio/wav",
#                     help=f"Download the generated audio as {filename}"
#                 )
                
#                 # Also show audio player
#                 st.audio(audio_data, format='audio/wav')
#                 st.success(f"✅ Audio ready for download as {filename}")
                
#             else:
#                 error_detail = response.json().get('error', 'Unknown error')
#                 st.error(f"❌ Error generating audio for download: {error_detail}")
                
#         except requests.exceptions.ConnectionError:
#             st.error("🔌 Could not connect to the backend.")
#         except Exception as e:
#             st.error(f"❌ An unexpected error occurred: {e}")

# # Show audio from complete workflow if available
# if st.session_state.get('show_audio') and st.session_state.get('last_audio_b64'):
#     st.subheader("🎉 Complete Workflow Result")
#     try:
#         audio_bytes = base64.b64decode(st.session_state['last_audio_b64'])
#         st.audio(audio_bytes, format='audio/wav')
        
#         # Provide download for workflow result
#         timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
#         safe_language = target_language.replace(" ", "_").lower()
#         workflow_filename = f"complete_workflow_{safe_language}_{timestamp}.wav"
        
#         st.download_button(
#             label="📥 Download Complete Workflow Audio",
#             data=audio_bytes,
#             file_name=workflow_filename,
#             mime="audio/wav",
#             help=f"Download the complete workflow result as {workflow_filename}"
#         )
        
#         # Clear the flag
#         if st.button("🔄 Clear Workflow Result"):
#             st.session_state['show_audio'] = False
#             st.session_state['last_audio_b64'] = None
#             st.rerun()
            
#     except Exception as e:
#         st.error(f"❌ Error displaying workflow audio: {e}")

# # --- Sidebar with Information ---
# with st.sidebar:
#     st.header("ℹ️ Information")
    
#     st.subheader("📋 How to Use")
#     st.markdown("""
#     1. **Upload Voice**: Choose a clear 3-10 second audio sample
#     2. **Generate Script**: Enter a prompt and select target language
#     3. **Generate Audio**: Use the cloned voice to speak your script
#     4. **Download**: Save your generated audio as WAV file
#     """)
    
#     st.subheader("🎯 Tips for Best Results")
#     st.markdown("""
#     - Use high-quality, clear audio samples
#     - Avoid background noise in voice samples
#     - Keep scripts natural and conversational
#     - Experiment with audio parameters for different effects
#     """)
    
#     st.subheader("🔧 Current Settings")
#     if voice_id:
#         st.success("✅ Voice cloned and ready")
#     else:
#         st.warning("⚠️ No voice uploaded")
        
#     if st.session_state.get('generated_script'):
#         script_length = len(st.session_state['generated_script'].split())
#         st.info(f"📝 Script ready: {script_length} words")
    
#     st.markdown(f"🌍 **Target Language**: {target_language}")
#     st.markdown(f"🎛️ **Exaggeration**: {exaggeration}")
#     st.markdown(f"⚡ **Temperature**: {temperature}")
    
#     # Debug info (optional)
#     if st.checkbox("🔍 Show Debug Info"):
#         st.json({
#             "voice_id": voice_id[:8] + "..." if voice_id else None,
#             "script_length": len(st.session_state.get('generated_script', '')),
#             "text_length": len(text_to_speak),
#             "backend_url": BACKEND_URL
#         })

# # --- Footer ---
# st.markdown("---")
# st.markdown(
#     "**Chatterbox Voice Cloning** - Generate multilingual speech with cloned voices using AI 🤖✨"
# )



import streamlit as st
import requests
import io
import base64
import datetime

# --- Backend API Endpoint ---
BACKEND_URL = "http://localhost:8000/api"

st.set_page_config(page_title="Chatterbox Voice Cloning & Script Generation", layout="wide")

st.title("🗣️ Chatterbox Voice Cloning & Script Generation")
st.markdown("Upload a voice sample, generate a script in any language, and create speech with the cloned voice.")

# Create columns for better layout
col1, col2 = st.columns([1, 1])

with col1:
    # --- Voice Cloning Section ---
    st.subheader("1. 🎤 Clone a Voice")
    uploaded_file = st.file_uploader(
        "Upload a short (3-10 second) audio clip of the voice you want to clone",
        type=["wav", "mp3", "opus", "m4a"],
        help="Clear, high-quality audio works best. Avoid background noise."
    )

    voice_id = st.session_state.get('voice_id', None)
    cloned_voice_message = st.empty()

    if uploaded_file is not None:
        # Show audio file info
        st.info(f"📁 File: {uploaded_file.name} ({uploaded_file.size} bytes)")
        
        # Play the uploaded audio for preview
        st.audio(uploaded_file.getvalue(), format='audio/wav')
        
        audio_bytes = uploaded_file.read()
        files = {'audio_file': (uploaded_file.name, audio_bytes, uploaded_file.type)}
        
        with st.spinner("🔄 Cloning voice..."):
            try:
                response = requests.post(f"{BACKEND_URL}/voice_clone/", files=files)
                if response.status_code == 200:
                    result = response.json()
                    st.session_state['voice_id'] = result['voice_id']
                    cloned_voice_message.success(f"✅ {result['message']}")
                else:
                    cloned_voice_message.error(f"❌ Failed to clone voice: {response.json().get('error', 'Unknown error')}")
                    st.session_state['voice_id'] = None
            except requests.exceptions.ConnectionError:
                cloned_voice_message.error("🔌 Could not connect to the backend. Is it running on port 8000?")
                st.session_state['voice_id'] = None
            except Exception as e:
                cloned_voice_message.error(f"❌ An unexpected error occurred: {e}")
    else:
        st.session_state['voice_id'] = None
        cloned_voice_message.info("📤 Please upload an audio file to clone a voice.")

with col2:
    # --- Script Generation Section ---
    st.subheader("2. ✍️ Generate Script")
    
    script_prompt = st.text_area(
        "Enter a prompt for your script:",
        height=100,
        placeholder="e.g., 'a short podcast introduction about AI trends', 'a video ad for a new coffee machine', 'a motivational speech for students'"
    )

    target_language = st.selectbox(
    "🌍 Select target language:",
    ("English", "Spanish", "French", "German", "Hindi", "Punjabi", "Japanese", "Chinese"),
    help="The script will be generated and translated to this language"
    )

    # Add transliteration info for non-English languages
    if target_language.lower() != "english":
        st.info(f"🔤 **Transliteration Mode**: The script will be generated in {target_language} but written using English letters for TTS compatibility.")
        st.markdown("**Example**: Hindi 'नमस्कार दोस्तों' becomes 'namaste doston'")

    generated_script_display = st.empty()
    
    generate_script_button = st.button("📝 Generate Script Only", disabled=not script_prompt.strip())

    # Generate Script Only
    if generate_script_button and script_prompt.strip():
        with st.spinner(f"🤖 Generating script in {target_language}..."):
            try:
                response = requests.post(
                    f"{BACKEND_URL}/generate_script/",
                    json={"prompt": script_prompt, "language": target_language}
                )
                if response.status_code == 200:
                    result = response.json()
                    generated_script = result.get("script")
                    st.session_state['generated_script'] = generated_script
                    st.session_state['speech_text_area'] = generated_script
                    
                    generated_script_display.success("✅ Script generated successfully!")
                    
                    # Show script stats
                    word_count = result.get("word_count", 0)
                    char_count = result.get("character_count", 0)
                    st.info(f"📊 Generated script: {word_count} words, {char_count} characters")
                    
                else:
                    generated_script_display.error(f"❌ Error generating script: {response.json().get('error', 'Unknown error')}")
                    st.session_state['generated_script'] = None
            except requests.exceptions.ConnectionError:
                generated_script_display.error("🔌 Could not connect to the backend.")
            except Exception as e:
                generated_script_display.error(f"❌ An unexpected error occurred: {e}")

# --- Display Generated Script ---
if st.session_state.get('generated_script'):
    st.subheader(f"📄 Generated Script ({target_language})")
    
    # Make script editable
    edited_script = st.text_area(
        "Review and edit the script:",
        value=st.session_state['generated_script'],
        height=200,
        key="final_script_input"
    )
    
    if edited_script != st.session_state.get('speech_text_area', ''):
        st.session_state['speech_text_area'] = edited_script

# --- Audio Generation Section ---
st.subheader("3. 🔊 Generate Speech with Cloned Voice")

# Advanced parameters in an expander
with st.expander("🎛️ Advanced Audio Parameters"):
    col_param1, col_param2 = st.columns(2)
    
    with col_param1:
        exaggeration = st.slider(
            "Exaggeration", 
            min_value=0.25, max_value=2.0, value=0.5, step=0.05,
            help="0.25 = Neutral, 2.0 = Extreme expression"
        )
        st.session_state['exaggeration'] = exaggeration
        
        temperature = st.slider(
            "Temperature", 
            min_value=0.05, max_value=5.0, value=0.8, step=0.05,
            help="Higher = more varied, potentially less stable"
        )
        st.session_state['temperature'] = temperature
    
    with col_param2:
        cfg_weight = st.slider(
            "CFG/Pace", 
            min_value=0.0, max_value=1.0, value=0.5, step=0.05,
            help="0.0 = Default, 1.0 = More adherence to prompt"
        )
        st.session_state['cfg_weight'] = cfg_weight
        
        seed_num = st.number_input(
            "Random Seed", 
            min_value=0, value=0, step=1,
            help="0 for random, same number for reproducible results"
        )
        st.session_state['seed_num'] = seed_num

# Text input for speech
text_to_speak = st.text_area(
    "Enter text to speak:",
    value=st.session_state.get('speech_text_area', ''),
    height=120,
    key="speech_text_area",
    placeholder="Enter your text here or use the generated script above..."
)

# Audio generation buttons
col_audio1, col_audio2 = st.columns([1, 1])

with col_audio1:
    generate_audio_button = st.button(
        "🎵 Generate Audio",
        disabled=(voice_id is None or not text_to_speak.strip()),
        help="Generate audio for preview"
    )

with col_audio2:
    download_audio_button = st.button(
        "💾 Generate & Download",
        disabled=(voice_id is None or not text_to_speak.strip()),
        help="Generate audio and download as WAV file",
        type="secondary"
    )

# Status messages
if voice_id is None:
    st.warning("⚠️ Please upload a voice sample first.")
elif not text_to_speak.strip():
    st.warning("⚠️ Please enter text to generate speech.")

# Generate Audio for Preview
if generate_audio_button:
    with st.spinner("🎵 Generating audio..."):
        try:
            payload = {
                "voice_id": voice_id,
                "text": text_to_speak,
                "exaggeration": exaggeration,
                "cfg_weight": cfg_weight,
                "temperature": temperature,
                "seed_num": seed_num,
                "language": target_language
            }
            
            response = requests.post(f"{BACKEND_URL}/speak/", json=payload)
            
            if response.status_code == 200:
                audio_data = response.content
                st.audio(audio_data, format='audio/wav')
                st.success("✅ Audio generated successfully!")
                
                # Store for potential download
                st.session_state['last_generated_audio'] = audio_data
                
            else:
                error_detail = response.json().get('error', 'Unknown error')
                st.error(f"❌ Error generating audio: {error_detail}")
        except requests.exceptions.ConnectionError:
            st.error("🔌 Could not connect to the backend.")
        except Exception as e:
            st.error(f"❌ An unexpected error occurred: {e}")

# Generate and Download Audio
if download_audio_button:
    with st.spinner("💾 Generating audio for download..."):
        try:
            payload = {
                "voice_id": voice_id,
                "text": text_to_speak,
                "exaggeration": exaggeration,
                "cfg_weight": cfg_weight,
                "temperature": temperature,
                "seed_num": seed_num,
                "language": target_language
            }
            
            response = requests.post(f"{BACKEND_URL}/download_audio/", json=payload)
            
            if response.status_code == 200:
                audio_data = response.content
                
                # Create download link
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                safe_language = target_language.replace(" ", "_").lower()
                filename = f"cloned_voice_{safe_language}_{timestamp}.wav"
                
                st.download_button(
                    label="📥 Download Audio File",
                    data=audio_data,
                    file_name=filename,
                    mime="audio/wav",
                    help=f"Download the generated audio as {filename}"
                )
                
                # Also show audio player
                st.audio(audio_data, format='audio/wav')
                st.success(f"✅ Audio ready for download as {filename}")
                
            else:
                error_detail = response.json().get('error', 'Unknown error')
                st.error(f"❌ Error generating audio for download: {error_detail}")
                
        except requests.exceptions.ConnectionError:
            st.error("🔌 Could not connect to the backend.")
        except Exception as e:
            st.error(f"❌ An unexpected error occurred: {e}")

# --- Sidebar with Information ---
with st.sidebar:
    st.header("ℹ️ Information")
    
    st.subheader("📋 How to Use")
    st.markdown("""
    1. **Upload Voice**: Choose a clear 3-10 second audio sample
    2. **Generate Script**: Enter a prompt and select target language
    3. **Generate Audio**: Use the cloned voice to speak your script
    4. **Download**: Save your generated audio as WAV file
    """)
    
    st.subheader("🎯 Tips for Best Results")
    st.markdown("""
    - Use high-quality, clear audio samples
    - Avoid background noise in voice samples
    - Keep scripts natural and conversational
    - Experiment with audio parameters for different effects
    """)
    
    st.subheader("🔧 Current Settings")
    if voice_id:
        st.success("✅ Voice cloned and ready")
    else:
        st.warning("⚠️ No voice uploaded")
        
    if st.session_state.get('generated_script'):
        script_length = len(st.session_state['generated_script'].split())
        st.info(f"📝 Script ready: {script_length} words")
    
    st.markdown(f"🌍 **Target Language**: {target_language}")
    st.markdown(f"🎛️ **Exaggeration**: {exaggeration}")
    st.markdown(f"⚡ **Temperature**: {temperature}")
    
    # Debug info (optional)
    if st.checkbox("🔍 Show Debug Info"):
        st.json({
            "voice_id": voice_id[:8] + "..." if voice_id else None,
            "script_length": len(st.session_state.get('generated_script', '')),
            "text_length": len(text_to_speak),
            "backend_url": BACKEND_URL
        })

# --- Footer ---
st.markdown("---")
st.markdown(
    "**Chatterbox Voice Cloning** - Generate multilingual speech with cloned voices using AI 🤖✨"
)