import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Play, Pause, Download, Volume2 } from 'lucide-react';
import { theme, Button } from '../styles/GlobalStyles';

const PlayerContainer = styled.div`
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md};
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

const PlayerTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.gray[800]};
  margin: 0;
`;

const PlayerControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
`;

const PlayButton = styled(Button)<{ isPlaying: boolean }>`
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  padding: 0;
  background: ${({ isPlaying }) =>
    isPlaying
      ? `linear-gradient(135deg, ${theme.colors.accent[500]} 0%, ${theme.colors.accent[600]} 100%)`
      : `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%)`};
`;

const ProgressContainer = styled.div`
  flex: 1;
  margin: 0 ${theme.spacing.sm};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${theme.colors.gray[200]};
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%);
  border-radius: 3px;
  transition: width 0.1s ease-out;
  width: ${({ progress }) => progress}%;
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: ${theme.colors.gray[500]};
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: ${theme.colors.gray[200]};
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${theme.colors.primary[500]};
    cursor: pointer;
    border: 2px solid ${theme.colors.white};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: ${theme.colors.primary[500]};
    cursor: pointer;
    border: 2px solid ${theme.colors.white};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const Waveform = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  height: 40px;
  margin: ${theme.spacing.sm} 0;
`;

const WaveBar = styled.div<{ height: number; isActive: boolean }>`
  width: 3px;
  background: ${({ isActive }) =>
    isActive ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: 1.5px;
  transition: all 0.2s ease-in-out;
  height: ${({ height }) => height}px;
`;

interface AudioPlayerProps {
  audioUrl: string;
  title?: string;
  onDownload?: () => void;
  showWaveform?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  title = "Generated Audio",
  onDownload,
  showWaveform = true,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Mock waveform data - in a real app, this would be generated from audio analysis
  const waveformData = Array.from({ length: 50 }, () => Math.random() * 30 + 5);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerContainer>
      <PlayerHeader>
        <PlayerTitle>{title}</PlayerTitle>
        {onDownload && (
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download size={16} />
            Download
          </Button>
        )}
      </PlayerHeader>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <PlayerControls>
        <PlayButton
          isPlaying={isPlaying}
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </PlayButton>

        <ProgressContainer>
          <ProgressBar onClick={handleProgressClick}>
            <ProgressFill progress={progress} />
          </ProgressBar>
          <TimeDisplay>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </TimeDisplay>
        </ProgressContainer>

        <VolumeContainer>
          <Volume2 size={18} color={theme.colors.gray[500]} />
          <VolumeSlider
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
          />
        </VolumeContainer>
      </PlayerControls>

      {showWaveform && (
        <Waveform>
          {waveformData.map((height, index) => (
            <WaveBar
              key={index}
              height={height}
              isActive={progress > (index / waveformData.length) * 100}
            />
          ))}
        </Waveform>
      )}
    </PlayerContainer>
  );
};