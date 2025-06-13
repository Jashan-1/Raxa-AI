import { useState } from 'react';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

export interface VoiceCloneData {
  voice_id: string;
  analysis?: {
    duration: string;
    quality: string;
    language: string;
    clarity: number;
  };
}

export const useVoiceCloning = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [voiceData, setVoiceData] = useState<VoiceCloneData | null>(null);

  const uploadVoice = async (file: File) => {
    setIsUploading(true);
    try {
      const response = await apiService.cloneVoice({ audio_file: file });
      setVoiceData(response);
      toast.success('Voice sample uploaded and processed successfully!');
      return response;
    } catch (error: any) {
      console.error('Voice upload error:', error);
      toast.error(error.response?.data?.error || 'Failed to upload voice sample');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const clearVoiceData = () => {
    setVoiceData(null);
  };

  return {
    isUploading,
    voiceData,
    uploadVoice,
    clearVoiceData
  };
};