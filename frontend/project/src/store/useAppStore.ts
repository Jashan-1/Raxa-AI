import { create } from 'zustand';

export interface AppState {
  // Voice cloning state
  voiceFile: File | null;
  voiceId: string | null;
  isVoiceCloning: boolean;
  voiceCloningError: string | null;

  // Script generation state
  prompt: string;
  language: string;
  generatedScript: string;
  isGeneratingScript: boolean;
  scriptGenerationError: string | null;

  // Audio generation state
  audioParams: {
    exaggeration: number;
    temperature: number;
    cfg_weight: number;
    seed_num: number;
  };
  audioUrl: string | null;
  isGeneratingAudio: boolean;
  audioGenerationError: string | null;

  // Complete workflow state
  isRunningWorkflow: boolean;
  workflowStep: 'idle' | 'cloning' | 'generating_script' | 'generating_audio' | 'complete';
  workflowError: string | null;

  // Actions
  setVoiceFile: (file: File | null) => void;
  setVoiceId: (id: string | null) => void;
  setVoiceCloning: (loading: boolean) => void;
  setVoiceCloningError: (error: string | null) => void;

  setPrompt: (prompt: string) => void;
  setLanguage: (language: string) => void;
  setGeneratedScript: (script: string) => void;
  setGeneratingScript: (loading: boolean) => void;
  setScriptGenerationError: (error: string | null) => void;

  setAudioParams: (params: Partial<AppState['audioParams']>) => void;
  setAudioUrl: (url: string | null) => void;
  setGeneratingAudio: (loading: boolean) => void;
  setAudioGenerationError: (error: string | null) => void;

  setRunningWorkflow: (running: boolean) => void;
  setWorkflowStep: (step: AppState['workflowStep']) => void;
  setWorkflowError: (error: string | null) => void;

  resetState: () => void;
}

const initialAudioParams = {
  exaggeration: 0.5,
  temperature: 0.7,
  cfg_weight: 1.0,
  seed_num: 42,
};

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  voiceFile: null,
  voiceId: null,
  isVoiceCloning: false,
  voiceCloningError: null,

  prompt: '',
  language: 'en',
  generatedScript: '',
  isGeneratingScript: false,
  scriptGenerationError: null,

  audioParams: initialAudioParams,
  audioUrl: null,
  isGeneratingAudio: false,
  audioGenerationError: null,

  isRunningWorkflow: false,
  workflowStep: 'idle',
  workflowError: null,

  // Actions
  setVoiceFile: (file) => set({ voiceFile: file }),
  setVoiceId: (id) => set({ voiceId: id }),
  setVoiceCloning: (loading) => set({ isVoiceCloning: loading }),
  setVoiceCloningError: (error) => set({ voiceCloningError: error }),

  setPrompt: (prompt) => set({ prompt }),
  setLanguage: (language) => set({ language }),
  setGeneratedScript: (script) => set({ generatedScript: script }),
  setGeneratingScript: (loading) => set({ isGeneratingScript: loading }),
  setScriptGenerationError: (error) => set({ scriptGenerationError: error }),

  setAudioParams: (params) =>
    set((state) => ({
      audioParams: { ...state.audioParams, ...params },
    })),
  setAudioUrl: (url) => set({ audioUrl: url }),
  setGeneratingAudio: (loading) => set({ isGeneratingAudio: loading }),
  setAudioGenerationError: (error) => set({ audioGenerationError: error }),

  setRunningWorkflow: (running) => set({ isRunningWorkflow: running }),
  setWorkflowStep: (step) => set({ workflowStep: step }),
  setWorkflowError: (error) => set({ workflowError: error }),

  resetState: () =>
    set({
      voiceFile: null,
      voiceId: null,
      isVoiceCloning: false,
      voiceCloningError: null,
      prompt: '',
      generatedScript: '',
      isGeneratingScript: false,
      scriptGenerationError: null,
      audioParams: initialAudioParams,
      audioUrl: null,
      isGeneratingAudio: false,
      audioGenerationError: null,
      isRunningWorkflow: false,
      workflowStep: 'idle',
      workflowError: null,
    }),
}));