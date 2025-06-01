import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import ChatRoom from './pages/ChatRoom';
import StealthMode from './components/StealthMode';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-stealth-dark text-white">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/room/:roomId" element={<ChatRoom />} />
            <Route path="/stealth" element={<StealthMode />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App; 