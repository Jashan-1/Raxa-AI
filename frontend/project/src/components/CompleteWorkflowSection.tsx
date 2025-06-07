import React from 'react';
import styled from 'styled-components';
import { Zap, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, Button, theme } from '../styles/GlobalStyles';
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

const WorkflowSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const StepCard = styled.div<{ isActive: boolean; isComplete: boolean }>`
  padding: ${theme.spacing.md};
  border: 2px solid ${({ isActive, isComplete }) =>
    isComplete ? theme.colors.success[500] : 
    isActive ? theme.colors.primary[500] : 
    theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.md};
  background: ${({ isActive, isComplete }) =>
    isComplete ? theme.colors.success[50] : 
    isActive ? theme.colors.primary[50] : 
    theme.colors.white};
  transition: all 0.3s ease-in-out;
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StepNumber = styled.div<{ isActive: boolean; isComplete: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ isActive, isComplete }) =>
    isComplete ? theme.colors.success[500] : 
    isActive ? theme.colors.primary[500] : 
    theme.colors.gray[300]};
  color: ${({ isActive, isComplete }) =>
    isActive || isComplete ? theme.colors.white : theme.colors.gray[600]};
`;

const StepTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${theme.colors.gray[800]};
  margin: 0;
`;

const StepDescription = styled.p`
  font-size: 0.875rem;
  color: ${theme.colors.gray[600]};
  margin: 0;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const WorkflowButton = styled(Button)`
  font-size: 1.125rem;
  padding: 1rem 2rem;
  min-width: 200px;
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-weight: 500;
  
  ${({ type }) => {
    switch (type) {
      case 'success':
        return `
          background: ${theme.colors.success[50]};
          color: ${theme.colors.success[700]};
          border: 1px solid ${theme.colors.success[200]};
        `;
      case 'error':
        return `
          background: ${theme.colors.error[50]};
          color: ${theme.colors.error[700]};
          border: 1px solid ${theme.colors.error[200]};
        `;
      default:
        return `
          background: ${theme.colors.primary[50]};
          color: ${theme.colors.primary[700]};
          border: 1px solid ${theme.colors.primary[200]};
        `;
    }
  }}
`;

const WORKFLOW_STEPS = [
  {
    id: 'cloning',
    title: 'Clone Voice',
    description: 'Analyzing and cloning your voice from the uploaded sample',
  },
  {
    id: 'generating_script',
    title: 'Generate Script',
    description: 'Creating engaging podcast content based on your prompt',
  },
  {
    id: 'generating_audio',
    title: 'Synthesize Audio',
    description: 'Converting script to speech using your cloned voice',
  },
];

export const CompleteWorkflowSection: React.FC = () => {
  const {
    voiceFile,
    prompt,
    language,
    audioParams,
    isRunningWorkflow,
    workflowStep,
    workflowError,
    audioUrl,
    setRunningWorkflow,
    setWorkflowStep,
    setWorkflowError,
    setVoiceId,
    setGeneratedScript,
    setAudioUrl,
  } = useAppStore();

  const canRunWorkflow = voiceFile && prompt.trim();

  const getStepStatus = (stepId: string) => {
    const stepIndex = WORKFLOW_STEPS.findIndex(step => step.id === stepId);
    const currentStepIndex = WORKFLOW_STEPS.findIndex(step => step.id === workflowStep);
    
    if (workflowStep === 'complete' || stepIndex < currentStepIndex) {
      return 'complete';
    } else if (stepIndex === currentStepIndex && isRunningWorkflow) {
      return 'active';
    }
    return 'pending';
  };

  const handleRunCompleteWorkflow = async () => {
    if (!voiceFile || !prompt.trim()) return;

    setRunningWorkflow(true);
    setWorkflowError(null);
    setWorkflowStep('cloning');

    try {
      const response = await apiService.completeWorkflow({
        audio_file: voiceFile,
        prompt: prompt.trim(),
        language,
        ...audioParams,
      });

      // Assuming the API returns all the results
      if (response.voice_id) setVoiceId(response.voice_id);
      if (response.script) setGeneratedScript(response.script);
      if (response.audio_url) setAudioUrl(response.audio_url);

      setWorkflowStep('complete');
    } catch (error: any) {
      console.error('Complete workflow failed:', error);
      const errorMessage = error.response?.data?.error || 'Workflow failed. Please try again.';
      setWorkflowError(errorMessage);
    } finally {
      setRunningWorkflow(false);
    }
  };

  const getStatusMessage = () => {
    if (workflowError) {
      return (
        <StatusMessage type="error">
          <AlertCircle size={18} />
          {workflowError}
        </StatusMessage>
      );
    }

    if (workflowStep === 'complete' && audioUrl) {
      return (
        <StatusMessage type="success">
          <CheckCircle size={18} />
          Podcast created successfully! Check the audio player above.
        </StatusMessage>
      );
    }

    if (isRunningWorkflow) {
      return (
        <StatusMessage type="info">
          <Clock size={18} />
          Workflow in progress... This may take a few minutes.
        </StatusMessage>
      );
    }

    return null;
  };

  return (
    <Card>
      <SectionHeader>
        <Zap size={24} color={theme.colors.accent[500]} />
        <SectionTitle>Complete Workflow</SectionTitle>
      </SectionHeader>

      <SectionDescription>
        Run the complete podcast creation workflow in one go. This will clone your voice, generate a script, and create the final audio automatically.
      </SectionDescription>

      <WorkflowSteps>
        {WORKFLOW_STEPS.map((step, index) => {
          const status = getStepStatus(step.id);
          return (
            <StepCard
              key={step.id}
              isActive={status === 'active'}
              isComplete={status === 'complete'}
            >
              <StepHeader>
                <StepNumber
                  isActive={status === 'active'}
                  isComplete={status === 'complete'}
                >
                  {status === 'complete' ? (
                    <CheckCircle size={14} />
                  ) : (
                    index + 1
                  )}
                </StepNumber>
                <StepTitle>{step.title}</StepTitle>
              </StepHeader>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          );
        })}
      </WorkflowSteps>

      <ActionContainer>
        <WorkflowButton
          onClick={handleRunCompleteWorkflow}
          disabled={!canRunWorkflow || isRunningWorkflow}
          size="lg"
        >
          {isRunningWorkflow ? (
            <>
              <LoadingSpinner size="sm" />
              Running Workflow...
            </>
          ) : (
            <>
              <Zap size={20} />
              Create Complete Podcast
            </>
          )}
        </WorkflowButton>

        {getStatusMessage()}

        {isRunningWorkflow && (
          <LoadingSpinner 
            type="waveform" 
            text={`Step ${WORKFLOW_STEPS.findIndex(s => s.id === workflowStep) + 1} of ${WORKFLOW_STEPS.length}: ${WORKFLOW_STEPS.find(s => s.id === workflowStep)?.title}...`}
          />
        )}
      </ActionContainer>
    </Card>
  );
};