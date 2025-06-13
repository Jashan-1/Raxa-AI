import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  FileText, 
  Sparkles, 
  Globe, 
  Copy, 
  Download, 
  ArrowRight, 
  Loader,
  VideoIcon,
  Mic,
  Instagram,
  Youtube,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useScriptGeneration } from '../hooks/useScriptGeneration';
import { useAppContext } from '../context/AppContext';

interface ScriptForm {
  prompt: string;
  language: string;
  contentType: string;
  tone: string;
  duration: string;
}

const GenerateScript: React.FC = () => {
  const [wordCount, setWordCount] = useState(0);
  const [estimatedDuration, setEstimatedDuration] = useState('0:00');

  const { isGenerating, generatedScript, generateScript, setGeneratedScript } = useScriptGeneration();
  const { voiceData, setCurrentScript, setCurrentStep } = useAppContext();

  const { register, handleSubmit, watch, setValue } = useForm<ScriptForm>({
    defaultValues: {
      contentType: 'youtube',
      tone: 'professional',
      duration: 'short',
      language: 'en'
    }
  });

  const watchedScript = watch();

  const contentTypes = [
    { id: 'youtube', name: 'YouTube Video', icon: Youtube, color: 'from-red-500 to-red-600' },
    { id: 'podcast', name: 'Podcast', icon: Mic, color: 'from-green-500 to-green-600' },
    { id: 'instagram', name: 'Instagram Reel', icon: Instagram, color: 'from-purple-500 to-pink-500' },
    { id: 'tiktok', name: 'TikTok', icon: VideoIcon, color: 'from-black to-gray-800' },
    { id: 'custom', name: 'Custom', icon: Settings, color: 'from-blue-500 to-blue-600' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
  ];

  const examplePrompts = [
    "A short podcast introduction about AI trends in 2024",
    "A video ad for a new coffee machine with premium features", 
    "A motivational speech for students preparing for exams",
    "An Instagram reel about healthy morning routines",
    "A TikTok video explaining quantum physics in simple terms"
  ];

  const onSubmit = async (data: ScriptForm) => {
    try {
      await generateScript({
        prompt: data.prompt,
        language: data.language,
        contentType: data.contentType,
        tone: data.tone,
        duration: data.duration
      });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  // Update word count and duration when script changes
  React.useEffect(() => {
    if (generatedScript) {
      const words = generatedScript.split(' ').length;
      setWordCount(words);
      // Estimate duration (average 150 words per minute)
      const minutes = Math.ceil(words / 150);
      const seconds = Math.ceil((words % 150) / 2.5);
      setEstimatedDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      
      // Update context
      setCurrentScript(generatedScript);
      setCurrentStep(3);
    }
  }, [generatedScript, setCurrentScript, setCurrentStep]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    toast.success('Script copied to clipboard!');
  };

  const downloadScript = () => {
    const blob = new Blob([generatedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-script.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Script downloaded!');
  };

  const useExamplePrompt = (prompt: string) => {
    setValue('prompt', prompt);
  };

  const handleScriptEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedScript(e.target.value);
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
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-secondary-100 to-accent-100 text-secondary-700 rounded-full text-sm font-medium mb-6">
            <FileText className="h-4 w-4 mr-2" />
            Step 2: Generate Script
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Script Generation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create engaging scripts for any content type using advanced AI technology
          </p>
          {!voiceData && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg inline-block">
              <p className="text-sm text-yellow-800">
                💡 Upload a voice sample first for the complete workflow
              </p>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Content Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-4">
                    Content Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {contentTypes.map((type) => (
                      <label
                        key={type.id}
                        className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 ${
                          watchedScript.contentType === type.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          value={type.id}
                          {...register('contentType')}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${type.color} mb-2`}>
                            <type.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {type.name}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Target Language
                  </label>
                  <select
                    {...register('language')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Prompt Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Content Description
                  </label>
                  <textarea
                    {...register('prompt', { required: true })}
                    rows={4}
                    placeholder="Describe what you want to create..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Advanced Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Tone
                    </label>
                    <select
                      {...register('tone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="educational">Educational</option>
                      <option value="humorous">Humorous</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Duration
                    </label>
                    <select
                      {...register('duration')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="short">Short (30s-1min)</option>
                      <option value="medium">Medium (1-3min)</option>
                      <option value="long">Long (3-5min)</option>
                      <option value="extended">Extended (5min+)</option>
                    </select>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-secondary-600 to-accent-600 hover:from-secondary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGenerating ? (
                    <>
                      <Loader className="animate-spin h-5 w-5 mr-3" />
                      Generating Script...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-3" />
                      Generate Script
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Example Prompts */}
            <motion.div
              className="bg-blue-50 rounded-2xl border border-blue-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Example Prompts
              </h3>
              <div className="space-y-2">
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => useExamplePrompt(prompt)}
                    className="block w-full text-left p-3 text-sm text-gray-700 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Generated Script
                </h3>
                {generatedScript && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <button
                      onClick={downloadScript}
                      className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              {generatedScript ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <textarea
                      value={generatedScript}
                      onChange={handleScriptEdit}
                      rows={12}
                      className="w-full bg-transparent border-none resize-none focus:outline-none text-gray-800 leading-relaxed"
                      placeholder="Your generated script will appear here..."
                    />
                  </div>

                  {/* Script Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 py-4 border-t border-gray-200">
                    <div className="flex items-center space-x-6">
                      <span>
                        <strong>{wordCount}</strong> words
                      </span>
                      <span>
                        <strong>{estimatedDuration}</strong> estimated duration
                      </span>
                    </div>
                    <button
                      onClick={() => handleSubmit(onSubmit)()}
                      disabled={isGenerating}
                      className="flex items-center text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Regenerate
                    </button>
                  </div>

                  {/* Next Step Button */}
                  <Link
                    to="/clone-speak"
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
                  >
                    Use This Script
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    Your generated script will appear here
                  </p>
                </div>
              )}
            </motion.div>

            {/* Tips */}
            <motion.div
              className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 Pro Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Be specific about your topic and target audience</li>
                <li>• Include the purpose and key message of your content</li>
                <li>• Mention any specific points you want to cover</li>
                <li>• Consider your brand voice and personality</li>
                <li>• Review and edit the generated script to match your style</li>
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
          <div className="inline-flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${voiceData ? 'bg-green-600' : 'bg-gray-200'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                {voiceData ? '✓' : '1'}
              </div>
              <span>Upload Voice</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${generatedScript ? 'bg-green-600' : 'bg-secondary-600'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                {generatedScript ? '✓' : '2'}
              </div>
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

export default GenerateScript;