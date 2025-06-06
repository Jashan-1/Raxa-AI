# Raxa-AI: Multilingual Voice Cloning & Script Generation

Raxa-AI is an open-source, self-hosted application designed to assist YouTubers, podcast creators, and other content creators in generating audio for their content in multiple languages using their own cloned voice. This project leverages ChatterboxTTS for high-quality voice synthesis and OpenAI's GPT for intelligent script generation and translation, offering a completely free solution for multilingual audio creation.

---
![Screenshot 2025-06-07 at 3 23 07 AM](https://github.com/user-attachments/assets/d4aa9a50-35a7-4fb5-9910-37dddfb2c2ec)
---

## 🚀 Key Features

* **🎙️ Voice Cloning:** Upload your own voice sample (WAV, MP3, Opus, M4A) to clone your voice for personalized audio generation. The system handles automatic audio preprocessing and resampling.
* **✍️ Multilingual Script Generation & Translation:**
    * Generate engaging scripts using OpenAI's GPT-4, tailored to your prompts.
    * Automatic translation of generated scripts into 8 supported languages: English, Spanish, French, German, Hindi, Punjabi, Japanese, and Chinese.
    * Editable generated scripts for fine-tuning.
* **🔊 High-Quality Audio Generation:**
    * Seamless integration with ChatterboxTTS, optimized for performance, including Apple Silicon (M4) support.
    * Fine-tune audio output with advanced parameters: Exaggeration, Temperature, and CFG Weight.
    * Ensure reproducible results using a configurable random seed.
* **💾 Download Support:** Easily download your generated audio as timestamped WAV files for immediate use.

## 💡 How Raxa-AI Helps Content Creators

Raxa-AI empowers content creators to:
* **Expand Audience Reach:** Translate your content into multiple languages to reach a global audience without needing native speakers for voiceovers.
* **Maintain Brand Voice:** Use your own cloned voice across different languages, ensuring consistency in your content's personality.
* **Save Costs:** A completely free solution for multilingual audio creation, eliminating the need for expensive voice actors or third-party services.
* **Streamline Production:** Automate script generation and audio synthesis, significantly reducing your content production time.

## 🌐 Supported Languages

Raxa-AI supports script generation and audio synthesis in the following languages:
* English (en)
* Spanish (es)
* French (fr)
* German (de)
* Hindi (hi)
* Punjabi (pa)
* Japanese (ja)
* Chinese (zh)

**Important Note for Non-English Languages:** While ChatterboxTTS generally performs best with English, Raxa-AI employs a smart solution for multilingual audio. It is advised to upload an audio sample in the language you intend to generate the script and audio for. The script generation will handle transliteration for non-English languages to ensure compatibility with the TTS model (e.g., Hindi "नमस्कार दोस्तों" becomes "namaste doston").

## ⚙️ Audio Parameters Explained

* **Exaggeration (0.25-2.0):** Controls the emotional expression and dynamism of the cloned voice. Lower values result in more neutral speech, while higher values lead to more extreme and expressive delivery.
* **Temperature (0.05-5.0):** Influences the variation and creativity of the generated speech. Higher values can lead to more diverse and unpredictable output, potentially at the cost of stability, while lower values produce more consistent results.
* **CFG Weight (0.0-1.0):** (Classifier-Free Guidance Weight) Controls how strongly the audio generation adheres to the provided text prompt. Higher values increase adherence, while lower values allow more flexibility.
* **Seed:** A numerical seed for reproducible results. Setting the same seed will generate the identical audio output for the same text and parameters. Use `0` for random generation.

## 💻 Installation & Setup Instructions

Raxa-AI consists of a Django backend for API services and a Streamlit frontend for the user interface.

### 📋 Prerequisites

Before you begin, ensure you have:
* Python 3.8+ installed
* Git (optional, for cloning the repository)
* FFmpeg installed (essential for audio processing and format compatibility). You can download it from [ffmpeg.org](https://ffmpeg.org/download.html).

### 1. Backend Setup

The backend handles voice cloning, script generation, and audio synthesis.

**1.1. Navigate to the Backend Directory:**

```bash
cd backend
```
**1.2. Create a Virtual Environment:**
It's highly recommended to use a virtual environment to manage dependencies.

```bash
python -m venv venv
```

**1.3. Activate the Virtual Environment:**

On macOS/Linux:
```bash
source venv/bin/activate
```

On Windows:
```bash
venv\Scripts\activate
```

**1.4. Install Dependencies:**
First, download the requirements.txt file into your backend directory. Then, install the required Python packages:

```bash
pip install -r requirements.txt
```

**1.5. Install ChatterboxTTS:**

ChatterboxTTS needs to be installed separately. Refer to the official ChatterboxTTS documentation for the most up-to-date installation instructions for your system. A common installation method is via pip:


```bash
pip install chatterbox-tts
```

Alternatively, you might need to install it from source if you require specific optimizations or versions.

**1.6. Set Up Environment Variables:**

Create a `.env` file in your backend directory and populate it with the necessary configurations.


```bash
cp .env.example .env
```


Edit the `.env` file with your actual values:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Django Settings (optional)

DEBUG=True
SECRET_KEY=your_django_secret_key_here # Generate a strong, random key

```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

**1.7. Run Django Migrations (if applicable):**

If your Django backend uses a database, apply migrations:

```bash
python manage.py migrate
```

**1.8. Start the Backend Server:**

```bash
python manage.py runserver 0.0.0.0:8000
```

The backend API will be accessible at `http://localhost:8000/api/`.

---

**2. Frontend Setup**
The frontend provides the user interface for interacting with Raxa-AI.

**2.1. Navigate to the Frontend Directory:**
Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```
**2.2. Create and Activate Virtual Environment:**
(You can reuse the backend's virtual environment if you prefer, but a separate one is cleaner.)

```bash
python -m venv venv
```

On macOS/Linux:
```bash
source venv/bin/activate
```

On Windows:
```bash
venv\Scripts\activate
```

**2.3. Install Dependencies:**
First, download the requirements.txt file into your frontend directory. Then, install the required Python packages:

```bash
pip install -r requirements.txt
```

**2.4. Start the Streamlit Application:**

```bash
streamlit run app.py --server.port 8501
```

**3. Access the Application**

Once both the backend and frontend servers are running, you can access Raxa-AI:

- **Frontend (Streamlit UI)**: http://localhost:8501
- **Backend (Django API Base)**: http://localhost:8000
- **Backend API Documentation**: http://localhost:8000/api/

## 📂 File Structure

```
project/
├── backend/
│   ├── base_app/
│   │   ├── utils.py          # Enhanced utilities for audio/script processing
│   │   ├── views.py          # API views for voice clone, script generation, speak, download
│   │   ├── urls.py           # URL configurations for backend API endpoints
│   │   └── ...               # Other Django app files
│   ├── requirements.txt      # Backend Python dependencies
│   ├── .env.example          # Example environment variables file
│   ├── .env                  # Environment variables (private)
│   └── manage.py             # Django management command
├── frontend/
│   ├── app.py                # Streamlit application code
│   ├── requirements.txt      # Frontend Python dependencies
│   └── ...                   # Other frontend assets/files
└── README.md                 # This README file
```

## ⚠️ Troubleshooting

### Common Issues

- **ChatterboxTTS Installation:** If you encounter issues, refer to the official ChatterboxTTS installation guide for specific instructions tailored to your operating system.

- **Apple Silicon Support:** The code is designed to leverage Apple's MPS (Metal Performance Shaders) for M4 chips. Ensure your environment is correctly set up for PyTorch with MPS.

- **Audio Format Support (FFmpeg):** Ensure FFmpeg is correctly installed and accessible in your system's PATH. This is crucial for handling various audio formats (MP3, M4A, Opus).

- **OpenAI API Key:** Double-check that your `OPENAI_API_KEY` in the `.env` file is correct and has the necessary permissions.

- **Connection Errors:** If the frontend cannot connect to the backend, ensure the Django server is running and accessible on http://localhost:8000.

- **Port Configuration:** For the frontend, change `--server.port 8501` in the streamlit run command if needed.

---

## Port Configuration

- **Backend**: localhost:8000
- **Frontend**: localhost:8501

If these ports are already in use on your system, you might need to modify them:

- For the backend, change `0.0.0.0:8000` in the runserver command.
- For the frontend, change `--server.port 8501` in the streamlit run command.
- 

## ⭐ Show Your Support

Raxa-AI offers a powerful and free solution for content creators to expand their reach with multilingual audio. We hope you find it useful!

If you find Raxa-AI helpful, please consider starring this repository on GitHub! Your support motivates me to continue improving this project.


## ✉️ Contact

For any questions, feedback, or collaborations, feel free to reach out:

- **Email**: 686jashan@gmail.com
- **GitHub**: [Jashan-1](https://github.com/Jashan-1) 

