import { useState } from 'react';
import { apiService, AudioGenerationRequest } from '../services/api';
import toast from 'react-hot-toast';

export const useAudioGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const generateAudio = async (data: AudioGenerationRequest) => {
    setIsGenerating(true);
    try {
      const blob = await apiService.generateAudio(data);
      setAudioBlob(blob);
      
      // Create URL for audio playback
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      
      toast.success('Audio generated successfully!');
      return { blob, url };
    } catch (error: any) {
      console.error('Audio generation error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate audio');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAudio = async (data: {
    text: string;
    voice_id: string;
    language?: string;
    exaggeration?: number;
    temperature?: number;
    cfg_weight?: number;
    seed_num?: number;
  }, filename: string = 'generated-audio.wav') => {
    try {
      const blob = await apiService.downloadAudio(data);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Audio download started!');
    } catch (error: any) {
      console.error('Audio download error:', error);
      toast.error(error.response?.data?.error || 'Failed to download audio');
      throw error;
    }
  };

  const clearAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
  };

  return {
    isGenerating,
    audioBlob,
    audioUrl,
    generateAudio,
    downloadAudio,
    clearAudio
  };
};