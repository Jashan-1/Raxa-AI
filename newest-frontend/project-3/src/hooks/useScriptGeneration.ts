import { useState } from 'react';
import { apiService, ScriptGenerationRequest } from '../services/api';
import toast from 'react-hot-toast';

export const useScriptGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<string>('');

  const generateScript = async (data: ScriptGenerationRequest) => {
    setIsGenerating(true);
    try {
      const response = await apiService.generateScript(data);
      setGeneratedScript(response.script || response.generated_script);
      toast.success('Script generated successfully!');
      return response;
    } catch (error: any) {
      console.error('Script generation error:', error);
      toast.error(error.response?.data?.error || 'Failed to generate script');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearScript = () => {
    setGeneratedScript('');
  };

  return {
    isGenerating,
    generatedScript,
    generateScript,
    clearScript,
    setGeneratedScript
  };
};