import axios from 'axios';

// Configure axios base URL - update this to match your Django backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for long audio generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

export interface VoiceCloneRequest {
  audio_file: File;
}

export interface ScriptGenerationRequest {
  prompt: string;
  language: string;
  contentType?: string;
  tone?: string;
  duration?: string;
}

export interface AudioGenerationRequest {
  text: string;
  voice_id?: string;
  exaggeration?: number;
  temperature?: number;
  cfg_weight?: number;
  seed_num?: number;
}

export interface AudioDownloadRequest {
  text: string;
  voice_id: string;
  language?: string;
  exaggeration?: number;
  temperature?: number;
  cfg_weight?: number;
  seed_num?: number;
}

export interface CompleteWorkflowRequest {
  audio_file: File;
  prompt: string;
  language: string;
  exaggeration?: number;
  temperature?: number;
  cfg_weight?: number;
  seed_num?: number;
}

export const apiService = {
  // Voice cloning
  cloneVoice: async (data: VoiceCloneRequest) => {
    const formData = new FormData();
    formData.append('audio_file', data.audio_file);
    
    const response = await api.post('/api/voice_clone/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Script generation
  generateScript: async (data: ScriptGenerationRequest) => {
    const response = await api.post('/api/generate_script/', data);
    return response.data;
  },

  // Audio generation
  generateAudio: async (data: AudioGenerationRequest) => {
    const response = await api.post('/api/speak/', data, {
      responseType: 'blob', // ✅ Expect binary data
    });
    return response.data; // This will be a Blob
  },

  // Download audio
  downloadAudio: async (data: {
    text: string;
    voice_id: string;
    language?: string;
    exaggeration?: number;
    temperature?: number;
    cfg_weight?: number;
    seed_num?: number;
  }) => {
    const response = await api.post('/api/download_audio/', data, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Complete workflow
  completeWorkflow: async (data: CompleteWorkflowRequest) => {
    const formData = new FormData();
    formData.append('audio_file', data.audio_file);
    formData.append('prompt', data.prompt);
    formData.append('language', data.language);
    
    if (data.exaggeration !== undefined) {
      formData.append('exaggeration', data.exaggeration.toString());
    }
    if (data.temperature !== undefined) {
      formData.append('temperature', data.temperature.toString());
    }
    if (data.cfg_weight !== undefined) {
      formData.append('cfg_weight', data.cfg_weight.toString());
    }
    if (data.seed_num !== undefined) {
      formData.append('seed_num', data.seed_num.toString());
    }

    const response = await api.post('/api/complete_workflow/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default apiService;