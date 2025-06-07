import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Upload, X, CheckCircle, AlertCircle, File } from 'lucide-react';
import { theme, Button } from '../styles/GlobalStyles';

const DropZone = styled.div<{ isDragActive: boolean; hasFile: boolean }>`
  border: 2px dashed ${({ isDragActive, hasFile }) =>
    hasFile ? theme.colors.success[500] : isDragActive ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background: ${({ isDragActive }) =>
    isDragActive ? theme.colors.primary[50] : theme.colors.gray[50]};

  &:hover {
    border-color: ${theme.colors.primary[500]};
    background: ${theme.colors.primary[50]};
  }
`;

const UploadIcon = styled.div<{ isDragActive: boolean }>`
  margin-bottom: ${theme.spacing.sm};
  color: ${({ isDragActive }) =>
    isDragActive ? theme.colors.primary[500] : theme.colors.gray[400]};
  transition: all 0.2s ease-in-out;

  svg {
    width: 3rem;
    height: 3rem;
  }
`;

const UploadText = styled.div`
  color: ${theme.colors.gray[600]};
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const UploadSubtext = styled.div`
  color: ${theme.colors.gray[500]};
  font-size: 0.875rem;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.success[500]};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  margin-top: ${theme.spacing.sm};
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const FileName = styled.span`
  font-weight: 500;
  color: ${theme.colors.gray[700]};
`;

const FileSize = styled.span`
  font-size: 0.875rem;
  color: ${theme.colors.gray[500]};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${theme.colors.gray[200]};
  border-radius: 2px;
  overflow: hidden;
  margin-top: ${theme.spacing.sm};
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.primary[500]} 0%, ${theme.colors.secondary[500]} 100%);
  border-radius: 2px;
  transition: width 0.3s ease-in-out;
  width: ${({ progress }) => progress}%;
`;

const HiddenInput = styled.input`
  display: none;
`;

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  acceptedFormats?: string[];
  maxSize?: number; // in MB
  currentFile?: File | null;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  acceptedFormats = ['.wav', '.mp3', '.m4a'],
  maxSize = 50,
  currentFile,
  isUploading = false,
  uploadProgress = 0,
  error,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file format
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      return `File must be one of: ${acceptedFormats.join(', ')}`;
    }

    return null;
  }, [acceptedFormats, maxSize]);

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }
    onFileSelect(file);
  }, [validateFile, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClick = () => {
    if (!currentFile) {
      const input = document.getElementById('file-input') as HTMLInputElement;
      input?.click();
    }
  };

  return (
    <div>
      {!currentFile ? (
        <DropZone
          isDragActive={isDragActive}
          hasFile={false}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <UploadIcon isDragActive={isDragActive}>
            <Upload />
          </UploadIcon>
          <UploadText>
            {isDragActive ? 'Drop your audio file here' : 'Click to upload or drag and drop'}
          </UploadText>
          <UploadSubtext>
            Supported formats: {acceptedFormats.join(', ')} (max {maxSize}MB)
          </UploadSubtext>
          <UploadSubtext>
            Recommended: 5-10 seconds of clear speech
          </UploadSubtext>
        </DropZone>
      ) : (
        <FileInfo>
          <FileDetails>
            <File size={20} color={theme.colors.success[500]} />
            <div>
              <FileName>{currentFile.name}</FileName>
              <br />
              <FileSize>{formatFileSize(currentFile.size)}</FileSize>
            </div>
          </FileDetails>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isUploading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem', color: theme.colors.primary[600] }}>
                  {uploadProgress}%
                </span>
              </div>
            ) : (
              <CheckCircle size={20} color={theme.colors.success[500]} />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onFileRemove}
              disabled={isUploading}
            >
              <X size={16} />
            </Button>
          </div>
        </FileInfo>
      )}

      {isUploading && (
        <ProgressBar>
          <ProgressFill progress={uploadProgress} />
        </ProgressBar>
      )}

      {error && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginTop: '0.5rem',
          color: theme.colors.error[500],
          fontSize: '0.875rem'
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <HiddenInput
        id="file-input"
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileInputChange}
      />
    </div>
  );
};