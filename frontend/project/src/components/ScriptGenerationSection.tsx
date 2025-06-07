import React from 'react';
import styled from 'styled-components';
import { FileText, Sparkles } from 'lucide-react';
import { Card, Button, TextArea, Select, Label, theme } from '../styles/GlobalStyles';
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing.md};
`;

const ScriptOutput = styled.div`
  background: ${theme.colors.gray[50]};
  border: 2px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
  min-height: 120px;
  white-space: pre-wrap;
  line-height: 1.6;
  color: ${theme.colors.gray[700]};
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

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
];

export const ScriptGenerationSection: React.FC = () => {
  const {
    prompt,
    language,
    generatedScript,
    isGeneratingScript,
    scriptGenerationError,
    setPrompt,
    setLanguage,
    setGeneratedScript,
    setGeneratingScript,
    setScriptGenerationError,
  } = useAppStore();

  const handleGenerateScript = async () => {
    if (!prompt.trim()) {
      setScriptGenerationError('Please enter a script prompt.');
      return;
    }

    setScriptGenerationError(null);
    setGeneratingScript(true);
    setGeneratedScript('');

    try {
      // Debug logs
      console.log('--- Debugging Script Generation API Call ---');
      console.log('Current Prompt:', prompt);
      console.log('Type of Prompt:', typeof prompt);
      console.log('Current Language:', language);
      console.log('Type of Language:', typeof language);
      console.log('Object being sent to API:', { prompt, language });

      const response = await apiService.generateScript({
        prompt: prompt.trim(),
        language,
      });
      setGeneratedScript(response.script || response.text || 'Script generated successfully!');
    } catch (error: any) {
      console.error('Script generation failed:', error);
      const errorMessage = error.response?.data?.error || 'Failed to generate script. Please try again.';
      setScriptGenerationError(errorMessage);
    } finally {
      setGeneratingScript(false);
    }
  };

  const handleClearScript = () => {
    setGeneratedScript('');
    setPrompt('');
    setScriptGenerationError(null);
  };

  return (
    <Card>
      <SectionHeader>
        <FileText size={24} color={theme.colors.secondary[500]} />
        <SectionTitle>Generate Script</SectionTitle>
      </SectionHeader>

      <SectionDescription>
        Describe the topic or theme for your podcast, and our AI will generate an engaging script for you.
      </SectionDescription>

      <FormGrid>
        <FormGroup>
          <Label htmlFor="prompt">Script Prompt</Label>
          <TextArea
            id="prompt"
            placeholder="e.g., Create a 2-minute podcast about the benefits of renewable energy, including solar and wind power statistics..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="language">Language</Label>
          <Select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </Select>
        </FormGroup>
      </FormGrid>

      <ActionContainer>
        {scriptGenerationError && (
          <div style={{ color: theme.colors.error[500], fontSize: '0.875rem' }}>
            {scriptGenerationError}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          {generatedScript && (
            <Button variant="outline" onClick={handleClearScript}>
              Clear Script
            </Button>
          )}
          
          <Button
            onClick={handleGenerateScript}
            disabled={isGeneratingScript || !prompt.trim()}
            size="lg"
          >
            {isGeneratingScript ? (
              <>
                <LoadingSpinner size="sm" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Script
              </>
            )}
          </Button>
        </div>
      </ActionContainer>

      {isGeneratingScript && (
        <div style={{ marginTop: theme.spacing.md }}>
          <LoadingSpinner 
            type="pulse" 
            text="AI is crafting your podcast script..." 
          />
        </div>
      )}

      {generatedScript && (
        <ScriptOutput>
          {generatedScript}
        </ScriptOutput>
      )}
    </Card>
  );
};