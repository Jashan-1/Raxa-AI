import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  FileAudio, 
  Clock, 
  Download, 
  Play, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Calendar,
  Mic,
  FileText,
  Volume2,
  Star,
  Share2,
  MoreVertical,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data
  const stats = {
    totalProjects: 24,
    audioMinutes: 142,
    voiceSamples: 8,
    downloadsThisMonth: 67
  };

  const recentProjects = [
    {
      id: 1,
      title: 'YouTube Introduction Video',
      type: 'youtube',
      duration: '2:15',
      created: '2 hours ago',
      status: 'completed',
      language: 'English',
      downloads: 3
    },
    {
      id: 2,
      title: 'Podcast Episode Intro',
      type: 'podcast',
      duration: '0:45',
      created: '1 day ago',
      status: 'completed',
      language: 'Spanish',
      downloads: 7
    },
    {
      id: 3,
      title: 'Instagram Reel Voiceover',
      type: 'instagram',
      duration: '0:30',
      created: '2 days ago',
      status: 'processing',
      language: 'French',
      downloads: 0
    },
    {
      id: 4,
      title: 'Product Demo Narration',
      type: 'custom',
      duration: '3:22',
      created: '3 days ago',
      status: 'completed',
      language: 'English',
      downloads: 12
    },
    {
      id: 5,
      title: 'Educational Tutorial',
      type: 'custom',
      duration: '5:30',
      created: '5 days ago',
      status: 'completed',
      language: 'German',
      downloads: 5
    }
  ];

  const voiceSamples = [
    { id: 1, name: 'Professional Voice', language: 'English', duration: '8s', quality: 95 },
    { id: 2, name: 'Casual Voice', language: 'English', duration: '5s', quality: 92 },
    { id: 3, name: 'Spanish Accent', language: 'Spanish', duration: '7s', quality: 88 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube': return '🎥';
      case 'podcast': return '🎙️';
      case 'instagram': return '📱';
      case 'tiktok': return '🎵';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600">
                Manage your voice cloning projects and track your content creation progress
              </p>
            </div>
            <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
              <Link
                to="/upload-voice"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Project
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {[
            { 
              icon: FileAudio, 
              label: 'Total Projects', 
              value: stats.totalProjects, 
              color: 'from-blue-500 to-blue-600',
              trend: '+12%'
            },
            { 
              icon: Clock, 
              label: 'Audio Minutes', 
              value: stats.audioMinutes, 
              color: 'from-green-500 to-green-600',
              trend: '+28%'
            },
            { 
              icon: Mic, 
              label: 'Voice Samples', 
              value: stats.voiceSamples, 
              color: 'from-purple-500 to-purple-600',
              trend: '+3'
            },
            { 
              icon: Download, 
              label: 'Downloads', 
              value: stats.downloadsThisMonth, 
              color: 'from-orange-500 to-orange-600',
              trend: '+45%'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">{stat.trend}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="youtube">YouTube</option>
                    <option value="podcast">Podcast</option>
                    <option value="instagram">Instagram</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {recentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getTypeIcon(project.type)}</div>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{project.duration}</span>
                          <span>•</span>
                          <span>{project.language}</span>
                          <span>•</span>
                          <span>{project.created}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
                          <Play className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                  View All Projects →
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voice Samples */}
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Voice Samples</h3>
                <Link
                  to="/upload-voice"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Add New
                </Link>
              </div>
              
              <div className="space-y-4">
                {voiceSamples.map((sample, index) => (
                  <motion.div
                    key={sample.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                        <Mic className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{sample.name}</div>
                        <div className="text-xs text-gray-600">{sample.language} • {sample.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-600">{sample.quality}%</div>
                      <button className="p-1 text-gray-600 hover:text-primary-600 transition-colors opacity-0 group-hover:opacity-100">
                        <Play className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl border border-primary-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/upload-voice"
                  className="flex items-center space-x-3 p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <Mic className="h-5 w-5 text-primary-600" />
                  <span className="font-medium text-gray-900 group-hover:text-primary-600">Upload Voice Sample</span>
                </Link>
                <Link
                  to="/generate-script"
                  className="flex items-center space-x-3 p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <FileText className="h-5 w-5 text-secondary-600" />
                  <span className="font-medium text-gray-900 group-hover:text-secondary-600">Generate Script</span>
                </Link>
                <Link
                  to="/clone-speak"
                  className="flex items-center space-x-3 p-3 bg-white hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <Volume2 className="h-5 w-5 text-accent-600" />
                  <span className="font-medium text-gray-900 group-hover:text-accent-600">Clone & Speak</span>
                </Link>
              </div>
            </motion.div>

            {/* Usage Stats */}
            <motion.div
              className="bg-white rounded-2xl border border-gray-200 p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Projects Created</span>
                  <span className="font-semibold text-gray-900">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Audio Generated</span>
                  <span className="font-semibold text-gray-900">42 min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Downloads</span>
                  <span className="font-semibold text-gray-900">67</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Free Tier Usage</span>
                    <span className="font-semibold text-green-600">Unlimited</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;