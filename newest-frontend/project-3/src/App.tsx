import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import About from './pages/About';
import UploadVoice from './pages/UploadVoice';
import GenerateScript from './pages/GenerateScript';
import CloneSpeak from './pages/CloneSpeak';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/upload-voice" element={<UploadVoice />} />
              <Route path="/generate-script" element={<GenerateScript />} />
              <Route path="/clone-speak" element={<CloneSpeak />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;