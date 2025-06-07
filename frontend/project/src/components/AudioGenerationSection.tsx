import React, { useState } from 'react';
import styled from 'styled-components';
import { Volume2, Settings, Play } from 'lucide-react';
import { Card, Button, TextArea, Label, theme } from '../styles/GlobalStyles';
import { LoadingSpinner } from './LoadingSpinner';
import { AudioPlayer } from './AudioPlayer';
import { useAppStore } from '../store/useAppStore';
import apiService from '../services/api';


const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.gray[800]};
  margin: 0;
`;

const SectionDescription = styled.p`
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.6;
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const AdvancedControls = styled.div<{ isOpen: boolean }>`
  margin-top: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.md};
  border: 2px solid ${theme.colors.gray[200]};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

const SliderGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const Slider = styled.input`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: ${theme.colors.gray[200]};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${theme.colors.primary[500]};
    cursor: pointer;
    border: 2px solid ${theme.colors.white};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${theme.colors.primary[500]};
    cursor: pointer;
    border: 2px solid ${theme.colors.white};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const SliderValue = styled.span`
  min-width: 40px;
  text-align: center;
  font-size: 0.875rem;
  color: ${theme.colors.gray[600]};
  font-weight: 500;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
    align-items: stretch;
  }
`;

const ToggleButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  tooltip?: string;
}

const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  tooltip,
}) => (
  <SliderGroup>
    <Label title={tooltip}>{label}</Label>
    <SliderContainer>
      <Slider
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <SliderValue>{value}</SliderValue>
    </SliderContainer>
  </SliderGroup>
);

export const AudioGenerationSection: React.FC = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scriptText, setScriptText] = useState('');
  
  const {
    generatedScript,
    voiceId,
    audioParams,
    audioUrl,
    isGeneratingAudio,
    audioGenerationError,
    setAudioParams,
    setAudioUrl,
    setGeneratingAudio,
    setAudioGenerationError,
  } = useAppStore();

  // Use generated script or allow manual input
  const currentScript = scriptText || generatedScript;

  const handleGenerateAudio = async () => {
    if (!currentScript.trim()) {
      setAudioGenerationError('Please provide a script to convert to audio.');
      return;
    }

    if (!voiceId) {
      setAudioGenerationError('Please clone your voice first.');
      return;
    }

    setGeneratingAudio(true);
    setAudioGenerationError(null);

  try {
    // ✅ Updated API call to handle binary response
    const response = await apiService.generateAudio({
      text: currentScript.trim(),
      voice_id: voiceId,
      ...audioParams,
    });
    
    // ✅ Check if response is a Blob (binary audio data)
    if (response instanceof Blob) {
      const audioUrl = URL.createObjectURL(response);
      setAudioUrl(audioUrl);
    } else {
      // Handle case where response might be JSON with error
      console.error('Unexpected response format:', response);
      setAudioGenerationError('Invalid audio response format');
    }
  } catch (error: any) {
    console.error('Audio generation failed:', error);
    const errorMessage = error.response?.data?.error || 'Failed to generate audio. Please try again.';
    setAudioGenerationError(errorMessage);
  } finally {
    setGeneratingAudio(false);
  }
};

  // const handleDownloadAudio = async () => {
  //   try {
  //     const audioBlob = await apiService.downloadAudio();
  //     const url = URL.createObjectURL(audioBlob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'podcast-audio.wav';
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error('Download failed:', error);
  //   }
  // };

  const handleDownloadAudio = async () => {
    if (!voiceId || !currentScript.trim()) {
      setAudioGenerationError('Please generate audio first.');
      return;
    }
  
    try {
      // ✅ Use apiService instead of api
      const response = await apiService.downloadAudio({
        text: currentScript.trim(),
        voice_id: voiceId,
        language: 'English',
        ...audioParams,
      });
  
      const audioBlob = response;
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `podcast-audio-${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Download failed:', error);
      setAudioGenerationError('Download failed. Please try again.');
    }
  };
  
  
  
  

  return (
    <Card>
      <SectionHeader>
        <Volume2 size={24} color={theme.colors.accent[500]} />
        <SectionTitle>Generate Audio</SectionTitle>
      </SectionHeader>

      <SectionDescription>
        Convert your script to speech using your cloned voice. Adjust the parameters below to customize the audio output.
      </SectionDescription>

      <FormGroup>
        <Label htmlFor="script-text">Script Text</Label>
        <TextArea
          id="script-text"
          placeholder={generatedScript ? "Edit the generated script or add your own content..." : "Enter your script here or generate one above..."}
          value={currentScript}
          onChange={(e) => setScriptText(e.target.value)}
          rows={6}
        />
      </FormGroup>

      <div>
        <ToggleButton
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Settings size={18} />
          Advanced Settings
        </ToggleButton>
      </div>

      <AdvancedControls isOpen={showAdvanced}>
        <ControlsGrid>
          <SliderControl
            label="Exaggeration"
            value={audioParams.exaggeration}
            min={0}
            max={1}
            step={0.1}
            onChange={(value) => setAudioParams({ exaggeration: value })}
            tooltip="Controls how expressive the voice sounds"
          />
          <SliderControl
            label="Temperature"
            value={audioParams.temperature}
            min={0.1}
            max={1.0}
            step={0.1}
            onChange={(value) => setAudioParams({ temperature: value })}
            tooltip="Controls randomness in voice generation"
          />
          <SliderControl
            label="CFG Weight"
            value={audioParams.cfg_weight}
            min={0.5}
            max={2.0}
            step={0.1}
            onChange={(value) => setAudioParams({ cfg_weight: value })}
            tooltip="Controls adherence to voice characteristics"
          />
          <SliderControl
            label="Seed"
            value={audioParams.seed_num}
            min={1}
            max={100}
            step={1}
            onChange={(value) => setAudioParams({ seed_num: value })}
            tooltip="Random seed for reproducible results"
          />
        </ControlsGrid>
      </AdvancedControls>

      <ActionContainer>
        {audioGenerationError && (
          <div style={{ color: theme.colors.error[500], fontSize: '0.875rem' }}>
            {audioGenerationError}
          </div>
        )}
        
        <Button
          onClick={handleGenerateAudio}
          disabled={isGeneratingAudio || !currentScript.trim() || !voiceId}
          size="lg"
        >
          {isGeneratingAudio ? (
            <>
              <LoadingSpinner size="sm" />
              Generating Audio...
            </>
          ) : (
            <>
              <Play size={18} />
              Generate Audio
            </>
          )}
        </Button>
      </ActionContainer>

      {isGeneratingAudio && (
        <div style={{ marginTop: theme.spacing.md }}>
          <LoadingSpinner 
            type="waveform" 
            text="Synthesizing your voice... This may take a moment." 
          />
        </div>
      )}

      {audioUrl && (
        <div style={{ marginTop: theme.spacing.lg }}>
          <AudioPlayer
            audioUrl={audioUrl}
            title="Generated Podcast Audio"
            onDownload={handleDownloadAudio}
            showWaveform={true}
          />
        </div>
      )}
    </Card>
  );
};