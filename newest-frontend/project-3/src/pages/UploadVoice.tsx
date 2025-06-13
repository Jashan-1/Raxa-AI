import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  Mic, 
  Play, 
  Pause, 
  Check, 
  AlertCircle, 
  FileAudio, 
  Trash2,
  ArrowRight,
  Info,
  Loader
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useVoiceCloning } from '../hooks/useVoiceCloning';
import { useAppContext } from '../context/AppContext';

const UploadVoice: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const { isUploading, voiceData, uploadVoice, clearVoiceData } = useVoiceCloning();
  const { setVoiceData: setContextVoiceData, setCurrentStep } = useAppContext();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      
      try {
        const response = await uploadVoice(file);
        setContextVoiceData({
          voice_id: response.voice_id,
          file_name: file.name,
          analysis: response.analysis
        });
        setCurrentStep(2);
      } catch (error) {
        // Error is already handled in the hook
        setUploadedFile(null);
        setAudioUrl(null);
      }
    }
  }, [uploadVoice, setContextVoiceData, setCurrentStep]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.flac']
    },
    multiple: false,
    disabled: isUploading
  });

  const togglePlayback = () => {
    if (!audioUrl) return;
    
    setIsPlaying(!isPlaying);
    // In a real implementation, you'd control actual audio playback here
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], 'recorded-voice.webm', { type: 'audio/webm' });
        
        setUploadedFile(file);
        setAudioUrl(URL.createObjectURL(blob));
        
        try {
          const response = await uploadVoice(file);
          setContextVoiceData({
            voice_id: response.voice_id,
            file_name: file.name,
            analysis: response.analysis
          });
          setCurrentStep(2);
        } catch (error) {
          setUploadedFile(null);
          setAudioUrl(null);
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      recorder.start();
      
      // Recording timer
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 10) {
            stopRecording();
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          stopRecording();
          clearInterval(timer);
        }
      }, 10000);
      
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setRecordingTime(0);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    clearVoiceData();
    setContextVoiceData(null);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            <Mic className="h-4 w-4 mr-2" />
            Step 1: Upload Voice Sample
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upload Your Voice Sample
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Provide a clear 3-10 second audio sample for the best voice cloning results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {!uploadedFile ? (
                <div className="space-y-6">
                  {/* Drag & Drop Zone */}
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                      isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : isUploading
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                        {isUploading ? (
                          <Loader className="h-8 w-8 text-white animate-spin" />
                        ) : (
                          <Upload className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {isUploading 
                            ? 'Processing your voice sample...' 
                            : isDragActive 
                            ? 'Drop your audio file here' 
                            : 'Drag & drop your audio file'
                          }
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {isUploading ? 'Please wait while we analyze your voice' : 'or click to browse files'}
                        </p>
                        {!isUploading && (
                          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all">
                            Choose File
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* OR Divider */}
                  {!isUploading && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                        </div>
                      </div>

                      {/* Record Button */}
                      <div className="text-center">
                        <button
                          onClick={isRecording ? stopRecording : startRecording}
                          disabled={isUploading}
                          className={`inline-flex items-center px-8 py-4 font-semibold rounded-xl transition-all duration-300 ${
                            isRecording
                              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                              : 'bg-white border-2 border-gray-200 hover:border-primary-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Mic className={`h-5 w-5 mr-3 ${isRecording ? 'animate-pulse' : ''}`} />
                          {isRecording ? `Recording... ${recordingTime}s` : 'Record Voice Sample'}
                        </button>
                        {isRecording && (
                          <p className="mt-2 text-sm text-gray-600">
                            Maximum 10 seconds • Click to stop early
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* File Preview */
                <motion.div
                  className="bg-white rounded-2xl border border-gray-200 p-8"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                        <FileAudio className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {uploadedFile.name}
                        </h3>
                        <p className="text-gray-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Audio Player */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={togglePlayback}
                        className="flex items-center justify-center w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: isPlaying ? '100%' : '0%' }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 font-mono">
                        0:00 / {voiceData?.analysis?.duration || '0:00'}
                      </span>
                    </div>
                  </div>

                  {/* Audio Analysis */}
                  {voiceData?.analysis && (
                    <motion.div
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900">
                          {voiceData.analysis.duration}
                        </div>
                        <div className="text-sm text-gray-600">Duration</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900">
                          {voiceData.analysis.quality}
                        </div>
                        <div className="text-sm text-gray-600">Quality</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900">
                          {voiceData.analysis.language}
                        </div>
                        <div className="text-sm text-gray-600">Language</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-semibold text-gray-900">
                          {voiceData.analysis.clarity}%
                        </div>
                        <div className="text-sm text-gray-600">Clarity</div>
                      </div>
                    </motion.div>
                  )}

                  {/* Success Message */}
                  {voiceData && (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="text-green-800 font-medium">
                          Voice sample ready for cloning!
                        </span>
                      </div>
                      <Link
                        to="/generate-script"
                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Tips & Requirements */}
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Info className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Requirements
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>3-10 seconds duration</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Clear audio quality</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Minimal background noise</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>MP3, WAV, M4A, OGG formats</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Maximum 10MB file size</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-blue-50 rounded-2xl border border-blue-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <Mic className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Best Practices
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>• Record in a quiet environment</li>
                <li>• Speak naturally and clearly</li>
                <li>• Use the same language as your target content</li>
                <li>• Avoid breathing sounds or mouth clicks</li>
                <li>• Test different samples for best results</li>
              </ul>
            </motion.div>

            <motion.div
              className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Privacy & Security
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                Your voice samples are processed securely and never shared. 
                All uploaded files are automatically deleted after 24 hours.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Next Steps */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${voiceData ? 'bg-green-600' : 'bg-primary-600'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                {voiceData ? '✓' : '1'}
              </div>
              <span>Upload Voice</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <span>Generate Script</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <span>Clone & Speak</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadVoice;