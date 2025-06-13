import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VoiceData {
  voice_id: string;
  file_name: string;
  analysis?: {
    duration: string;
    quality: string;
    language: string;
    clarity: number;
  };
}

interface AppContextType {
  // Voice data
  voiceData: VoiceData | null;
  setVoiceData: (data: VoiceData | null) => void;
  
  // Script data
  currentScript: string;
  setCurrentScript: (script: string) => void;
  
  // Audio settings
  audioSettings: {
    exaggeration: number;
    temperature: number;
    cfgWeight: number;
    randomSeed: number;
  };
  setAudioSettings: (settings: any) => void;
  
  // Current step in workflow
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [voiceData, setVoiceData] = useState<VoiceData | null>(null);
  const [currentScript, setCurrentScript] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [audioSettings, setAudioSettings] = useState({
    exaggeration: 0.3,
    temperature: 0.7,
    cfgWeight: 1.0,
    randomSeed: Math.floor(Math.random() * 10000)
  });

  const value: AppContextType = {
    voiceData,
    setVoiceData,
    currentScript,
    setCurrentScript,
    audioSettings,
    setAudioSettings,
    currentStep,
    setCurrentStep
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};