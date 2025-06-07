import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/GlobalStyles';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const wave = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.5); }
`;

const SpinnerContainer = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return 'min-height: 2rem;';
      case 'lg':
        return 'min-height: 4rem;';
      default:
        return 'min-height: 3rem;';
    }
  }}
`;

const Spinner = styled.div<{ size?: 'sm' | 'md' | 'lg' }>`
  border: 3px solid ${theme.colors.gray[200]};
  border-top: 3px solid ${theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return 'width: 1.5rem; height: 1.5rem; border-width: 2px;';
      case 'lg':
        return 'width: 3rem; height: 3rem; border-width: 4px;';
      default:
        return 'width: 2rem; height: 2rem;';
    }
  }}
`;

const PulseText = styled.span`
  animation: ${pulse} 1.5s ease-in-out infinite;
  color: ${theme.colors.gray[600]};
  font-weight: 500;
`;

const WaveformContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 2rem;
`;

const WaveBar = styled.div<{ delay: number }>`
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%);
  border-radius: 2px;
  animation: ${wave} 1.2s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
`;

interface LoadingSpinnerProps {
  type?: 'spinner' | 'waveform' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  type = 'spinner',
  size = 'md',
  text,
}) => {
  const renderSpinner = () => {
    switch (type) {
      case 'waveform':
        return (
          <WaveformContainer>
            {Array.from({ length: 5 }, (_, i) => (
              <WaveBar key={i} delay={i * 0.1} />
            ))}
          </WaveformContainer>
        );
      case 'pulse':
        return null;
      default:
        return <Spinner size={size} />;
    }
  };

  return (
    <SpinnerContainer size={size}>
      {renderSpinner()}
      {text && <PulseText>{text}</PulseText>}
    </SpinnerContainer>
  );
};