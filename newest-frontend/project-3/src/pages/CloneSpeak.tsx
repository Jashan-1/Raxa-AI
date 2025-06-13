import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Download, 
  Settings, 
  Volume2, 
  Sliders, 
  FileAudio,
  Copy,
  Share2,
  CheckCircle,
  Loader,
  RotateCcw,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAudioGeneration } from '../hooks/useAudioGeneration';
import { useAppContext } from '../context/AppContext';

const CloneSpeak: React.FC = () => {
  const [script, setScript] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const { isGenerating, audioBlob, audioUrl, generateAudio, downloadAudio, clearAudio } = useAudioGeneration();
  const { voiceData, currentScript, audioSettings, setAudioSettings } = useAppContext();

  // Initialize script from context
  useEffect(() => {
    if (currentScript) {
      setScript(currentScript);
    }
  }, [currentScript]);

  // Initialize audio element when audioUrl changes
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.addEventListener('ended', () => setIsPlaying(false));
      setAudioElement(audio);
      
      return () => {
        audio.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, [audioUrl]);

  const handleGenerateAudio = async () => {
    if (!script.trim()) {
      toast.error('Please enter a script to generate audio');
      return;
    }

    if (!voiceData?.voice_id) {
      toast.error('Please upload a voice sample first');
      return;
    }

    try {
      await generateAudio({
        text: script,
        voice_id: voiceData.voice_id,
        exaggeration: audioSettings.exaggeration,
        temperature: audioSettings.temperature,
        cfg_weight: audioSettings.cfgWeight,
        seed_num: audioSettings.randomSeed
      });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const togglePlayback = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const handleDownloadAudio = async (format: 'wav' | 'mp3' = 'wav') => {
    if (!voiceData?.voice_id) {
      toast.error('Voice data not available');
      return;
    }

    try {
      await downloadAudio({
        text: script,
        voice_id: voiceData.voice_id,
        exaggeration: audioSettings.exaggeration,
        temperature: audioSettings.temperature,
        cfg_weight: audioSettings.cfgWeight,
        seed_num: audioSettings.randomSeed
      }, `generated-audio.${format}`);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const copyScript = () => {
    navigator.clipboard.writeText(script);
    toast.success('Script copied to clipboard!');
  };

  const shareAudio = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Share link copied to clipboard!');
  };

  const regenerateWithNewSeed = () => {
    setAudioSettings(prev => ({
      ...prev,
      randomSeed: Math.floor(Math.random() * 10000)
    }));
    handleGenerateAudio();
  };

  const updateSetting = (key: string, value: number) => {
    setAudioSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyPreset = (preset: any) => {
    setAudioSettings(prev => ({
      ...prev,
      ...preset,
      randomSeed: prev.randomSeed // Keep current seed
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent-100 to-primary-100 text-accent-700 rounded-full text-sm font-medium mb-6">
            <Volume2 className="h-4 w-4 mr-2" />
            Step 3: Clone & Speak
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Generate Audio with Your Cloned Voice
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your script into professional audio using your cloned voice
          </p>
          {!voiceData && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg inline-block">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-800">
                  Please upload a voice sample first to use this feature
                </p>
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Script Input */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Script Content
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={copyScript}
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                  <Link
                    to="/generate-script"
                    className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 border border-primary-200 hover:border-primary-300 rounded-lg transition-colors"
                  >
                    Edit Script
                  </Link>
                </div>
              </div>
              
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-800 leading-relaxed"
                placeholder="Enter your script here..."
              />
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{script.split(' ').filter(word => word.length > 0).length}</span> words • 
                  <span className="font-medium ml-1">{Math.ceil(script.split(' ').filter(word => word.length > 0).length / 150)}</span> min estimated
                </div>
                <button
                  onClick={handleGenerateAudio}
                  disabled={isGenerating || !script.trim() || !voiceData}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-700 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-5 w-5 mr-3" />
                      Generate Audio
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Audio Player */}
            {audioUrl && (
              <motion.div
                className="bg-white rounded-2xl border border-gray-200 p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Generated Audio
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={shareAudio}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={regenerateWithNewSeed}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                      title="Regenerate with different voice variation"
                    >
                      <RotateCcw className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-6">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={togglePlayback}
                      className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-accent-600 to-primary-600 hover:from-accent-700 hover:to-primary-700 text-white rounded-full transition-all duration-200 transform hover:scale-105"
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8 ml-1" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>0:00</span>
                        <span>Audio Ready</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-accent-500 to-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: isPlaying ? '45%' : '0%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">WAV</div>
                      <div className="text-sm text-gray-600">High Quality</div>
                    </div>
                  </div>
                </div>

                {/* Audio Quality Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">High Quality</div>
                    <div className="text-xs text-gray-600">Studio Grade</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <FileAudio className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">Ready</div>
                    <div className="text-xs text-gray-600">Generated</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Volume2 className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-gray-900">98%</div>
                    <div className="text-xs text-gray-600">Voice Match</div>
                  </div>
                </div>

                {/* Download Options */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleDownloadAudio('wav')}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <Download className="h-5 w-5 mr-3" />
                    Download WAV
                  </button>
                  <button
                    onClick={() => handleDownloadAudio('mp3')}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold rounded-xl transition-all duration-200"
                  >
                    <Download className="h-5 w-5 mr-3" />
                    Download MP3
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Settings className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Voice Settings
                </h3>
              </div>

              <div className="space-y-6">
                {/* Exaggeration */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Exaggeration: {audioSettings.exaggeration.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={audioSettings.exaggeration}
                    onChange={(e) => updateSetting('exaggeration', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Natural</span>
                    <span>Expressive</span>
                  </div>
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Temperature: {audioSettings.temperature.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={audioSettings.temperature}
                    onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Consistent</span>
                    <span>Creative</span>
                  </div>
                </div>

                {/* CFG Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    CFG Weight: {audioSettings.cfgWeight.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={audioSettings.cfgWeight}
                    onChange={(e) => updateSetting('cfgWeight', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>Soft</span>
                    <span>Strong</span>
                  </div>
                </div>

                {/* Random Seed */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Random Seed
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={audioSettings.randomSeed}
                      onChange={(e) => updateSetting('randomSeed', parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => updateSetting('randomSeed', Math.floor(Math.random() * 10000))}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Different seeds produce voice variations
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Presets */}
            <motion.div
              className="bg-blue-50 rounded-2xl border border-blue-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Presets
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Professional', settings: { exaggeration: 0.2, temperature: 0.5, cfgWeight: 1.2 } },
                  { name: 'Enthusiastic', settings: { exaggeration: 0.7, temperature: 0.8, cfgWeight: 1.0 } },
                  { name: 'Calm & Clear', settings: { exaggeration: 0.1, temperature: 0.3, cfgWeight: 1.5 } },
                  { name: 'Dynamic', settings: { exaggeration: 0.5, temperature: 0.7, cfgWeight: 0.8 } }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.settings)}
                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Higher exaggeration for energetic content</li>
                <li>• Lower temperature for consistent narration</li>
                <li>• Try different seeds for voice variations</li>
                <li>• CFG weight affects voice adherence</li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Progress Steps */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="inline-flex items-center space-x-4 text-sm text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${voiceData ? 'bg-green-600' : 'bg-gray-200'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                {voiceData ? '✓' : '1'}
              </div>
              <span>Upload Voice</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${script ? 'bg-green-600' : 'bg-gray-200'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                {script ? '✓' : '2'}
              </div>
              <span>Generate Script</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${audioUrl ? 'bg-green-600' : 'bg-accent-600'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                {audioUrl ? '✓' : '3'}
              </div>
              <span>Clone & Speak</span>
            </div>
          </div>

          {audioUrl && (
            <Link
              to="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              View in Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CloneSpeak;