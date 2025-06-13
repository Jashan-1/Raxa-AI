import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Zap, 
  Globe, 
  Shield, 
  Code, 
  Mic, 
  FileText, 
  Play,
  CheckCircle,
  Star,
  Users,
  Award,
  Target,
  Lightbulb
} from 'lucide-react';

const About: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
                <Bot className="h-4 w-4 mr-2" />
                About Raxa-AI Platform
              </div>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Revolutionizing{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Multilingual Content
              </span>{' '}
              Creation
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed"
            >
              Built on cutting-edge open-source technology, Raxa-AI empowers content creators 
              to reach global audiences with professional-quality voice cloning and AI-powered 
              script generation.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Platform Advantages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Advantages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Why Raxa-AI stands out in the voice cloning and content generation landscape
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-8">
                {[
                  {
                    icon: Bot,
                    title: 'Superior Voice Cloning',
                    description: 'Leverages ChatterboxTTS for high-quality voice synthesis with just 3-10 seconds of audio',
                    color: 'from-primary-500 to-primary-600'
                  },
                  {
                    icon: Code,
                    title: 'Open Source Foundation',
                    description: 'Built on transparent, open-source technology that you can trust and verify',
                    color: 'from-secondary-500 to-secondary-600'
                  },
                  {
                    icon: Globe,
                    title: 'Multilingual Intelligence',
                    description: 'Smart transliteration system optimizes text for perfect pronunciation in any language',
                    color: 'from-accent-500 to-accent-600'
                  },
                  {
                    icon: Target,
                    title: 'Content Creator Focused',
                    description: 'Specifically designed for YouTube, Instagram, TikTok, and podcast creators',
                    color: 'from-purple-500 to-purple-600'
                  }
                ].map((advantage, index) => (
                  <motion.div
                    key={advantage.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className={`flex-shrink-0 p-3 rounded-xl bg-gradient-to-r ${advantage.color}`}>
                      <advantage.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {advantage.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {advantage.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 rounded-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { number: '99.9%', label: 'Uptime' },
                    { number: '50+', label: 'Languages' },
                    { number: '<3s', label: 'Processing Time' },
                    { number: '100%', label: 'Free Forever' }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center p-4 bg-white rounded-xl shadow-sm"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technical Excellence */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technical Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology stack delivering professional-quality results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Lightbulb,
                title: 'Advanced Transliteration',
                description: 'Converts scripts like Hindi "नमस्कार दोस्तों" to "namaste doston" for optimal TTS compatibility',
                example: 'हैलो → hello'
              },
              {
                icon: Bot,
                title: 'GPT-4o Integration',
                description: 'State-of-the-art script generation for YouTube videos, podcasts, and social media content',
                example: 'AI-powered creativity'
              },
              {
                icon: Shield,
                title: 'Language Optimization',
                description: 'Best results when voice sample matches target language for authentic pronunciation',
                example: 'Native-quality output'
              },
              {
                icon: FileText,
                title: 'Format Support',
                description: 'Multiple audio formats including MP3, WAV, OPUS, and M4A for maximum compatibility',
                example: 'Universal compatibility'
              },
              {
                icon: Zap,
                title: 'Real-time Processing',
                description: 'Lightning-fast audio generation with advanced caching and optimization',
                example: 'Sub-second response'
              },
              {
                icon: Award,
                title: 'Professional Quality',
                description: 'Studio-grade audio output suitable for commercial use and professional content',
                example: 'Broadcast-ready'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 mb-6">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 rounded-full text-sm font-medium">
                  {feature.example}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect for Every Creator
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From YouTubers to podcasters, Raxa-AI empowers creators across all platforms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'YouTube Videos',
                description: 'Create multilingual narration for your video content',
                icon: '🎥',
                color: 'from-red-500 to-red-600'
              },
              {
                title: 'Instagram Reels',
                description: 'Generate voiceovers for viral social media content',
                icon: '📱',
                color: 'from-purple-500 to-pink-500'
              },
              {
                title: 'Podcast Episodes',
                description: 'Produce professional podcast content in multiple languages',
                icon: '🎙️',
                color: 'from-green-500 to-green-600'
              },
              {
                title: 'TikTok Content',
                description: 'Create engaging short-form video narration',
                icon: '🎵',
                color: 'from-blue-500 to-blue-600'
              },
              {
                title: 'Educational Materials',
                description: 'Develop multilingual learning content and tutorials',
                icon: '📚',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                title: 'Marketing Content',
                description: 'Produce professional promotional and advertising audio',
                icon: '📢',
                color: 'from-indigo-500 to-purple-500'
              },
              {
                title: 'Audiobooks',
                description: 'Narrate books and stories in your own voice',
                icon: '📖',
                color: 'from-teal-500 to-cyan-500'
              },
              {
                title: 'Voice Memos',
                description: 'Create personalized voice messages and announcements',
                icon: '🗣️',
                color: 'from-pink-500 to-rose-500'
              }
            ].map((useCase, index) => (
              <motion.div
                key={useCase.title}
                className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-4">{useCase.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powered by Leading Technologies
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Built on the shoulders of giants with cutting-edge open-source technologies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'ChatterboxTTS',
                description: 'Open-source voice synthesis engine powering our voice cloning technology',
                type: 'Voice Synthesis'
              },
              {
                name: 'OpenAI GPT-4o',
                description: 'Advanced language model for intelligent script generation and content creation',
                type: 'AI Language Model'
              },
              {
                name: 'React & TypeScript',
                description: 'Modern web technologies ensuring a smooth and reliable user experience',
                type: 'Frontend Framework'
              },
              {
                name: 'Python & FastAPI',
                description: 'High-performance backend infrastructure for processing audio and text',
                type: 'Backend Technology'
              },
              {
                name: 'WebAudio API',
                description: 'Browser-native audio processing for real-time audio manipulation',
                type: 'Audio Processing'
              },
              {
                name: 'Docker & Kubernetes',
                description: 'Containerized deployment ensuring scalability and reliability',
                type: 'Infrastructure'
              }
            ].map((tech, index) => (
              <motion.div
                key={tech.name}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="mb-3">
                  <span className="inline-flex items-center px-3 py-1 bg-white/20 text-white text-xs font-medium rounded-full">
                    {tech.type}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {tech.name}
                </h3>
                <p className="text-primary-100 leading-relaxed">
                  {tech.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;