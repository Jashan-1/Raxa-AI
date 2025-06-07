import React from 'react';
import styled from 'styled-components';
import { Mic, CheckCircle } from 'lucide-react';
import { Card, Button, theme } from '../styles/GlobalStyles';
import { FileUpload } from './FileUpload';
import { LoadingSpinner } from './LoadingSpinner';
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

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${theme.spacing.sm};
    align-items: stretch;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.colors.success[600]};
  font-weight: 500;
`;

export const VoiceCloneSection: React.FC = () => {
  const {
    voiceFile,
    voiceId,
    isVoiceCloning,
    voiceCloningError,
    setVoiceFile,
    setVoiceId,
    setVoiceCloning,
    setVoiceCloningError,
  } = useAppStore();

  const handleFileSelect = (file: File) => {
    setVoiceFile(file);
    setVoiceCloningError(null);
  };

  const handleFileRemove = () => {
    setVoiceFile(null);
    setVoiceId(null);
    setVoiceCloningError(null);
  };

  const handleCloneVoice = async () => {
    if (!voiceFile) return;

    setVoiceCloning(true);
    setVoiceCloningError(null);

    try {
      const response = await apiService.cloneVoice({ audio_file: voiceFile });
      setVoiceId(response.voice_id || 'cloned_voice');
    } catch (error: any) {
      console.error('Voice cloning failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to clone voice. Please try again.';
      setVoiceCloningError(errorMessage);
    } finally {
      setVoiceCloning(false);
    }
  };

  return (
    <Card>
      <SectionHeader>
        <Mic size={24} color={theme.colors.primary[500]} />
        <SectionTitle>Clone Your Voice</SectionTitle>
      </SectionHeader>

      <SectionDescription>
        Upload a clear audio sample of your voice (5-10 seconds recommended) to create a personalized voice clone for your podcast content.
      </SectionDescription>

      <FileUpload
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
        currentFile={voiceFile}
        isUploading={isVoiceCloning}
        error={voiceCloningError}
        acceptedFormats={['.wav', '.mp3', '.m4a', '.flac']}
        maxSize={50}
      />

      <ActionContainer>
        <div>
          {voiceId && (
            <StatusIndicator>
              <CheckCircle size={20} />
              Voice successfully cloned!
            </StatusIndicator>
          )}
          {voiceCloningError && (
            <div style={{ color: theme.colors.error[500], fontSize: '0.875rem' }}>
              {voiceCloningError}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          {voiceFile && !voiceId && (
            <Button
              onClick={handleCloneVoice}
              disabled={isVoiceCloning}
              size="lg"
            >
              {isVoiceCloning ? (
                <>
                  <LoadingSpinner size="sm" />
                  Cloning Voice...
                </>
              ) : (
                'Clone Voice'
              )}
            </Button>
          )}

          {voiceId && (
            <Button
              variant="secondary"
              onClick={() => {
                setVoiceFile(null);
                setVoiceId(null);
              }}
              size="lg"
            >
              Upload New Voice
            </Button>
          )}
        </div>
      </ActionContainer>

      {isVoiceCloning && (
        <div style={{ marginTop: theme.spacing.md }}>
          <LoadingSpinner 
            type="waveform" 
            text="Analyzing and cloning your voice..." 
          />
        </div>
      )}
    </Card>
  );
};