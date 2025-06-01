import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { generateRoomId } from '../utils/encryption';
import QRCode from '../components/QRCode';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [newRoomId, setNewRoomId] = useState<string | null>(null);

  const startPrivateChat = () => {
    setIsGenerating(true);
    const roomId = generateRoomId();
    setNewRoomId(roomId);
    setTimeout(() => {
      navigate(`/room/${roomId}`);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">🌒 ShadowChat</h1>
          <p className="text-gray-400 mb-8">
            Ultra-private, temporary conversations with zero trace
          </p>
        </div>

        <div className="bg-stealth-light rounded-lg p-6 shadow-lg">
          {!newRoomId ? (
            <button
              onClick={startPrivateChat}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {isGenerating ? 'Generating Secure Room...' : 'Start Private Chat'}
            </button>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <QRCode roomId={newRoomId} className="mb-4" />
              <p className="text-gray-400 text-sm">
                Redirecting to your private chat room...
              </p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-stealth-dark rounded-lg">
                <h3 className="font-medium mb-2">🔒 End-to-End Encryption</h3>
                <p className="text-sm text-gray-400">Messages are encrypted and never stored</p>
              </div>
              <div className="p-4 bg-stealth-dark rounded-lg">
                <h3 className="font-medium mb-2">⏱️ Self-Destructing</h3>
                <p className="text-sm text-gray-400">Messages vanish after being read</p>
              </div>
              <div className="p-4 bg-stealth-dark rounded-lg">
                <h3 className="font-medium mb-2">🕵️ Stealth Mode</h3>
                <p className="text-sm text-gray-400">Quick hide with custom hotkeys</p>
              </div>
              <div className="p-4 bg-stealth-dark rounded-lg">
                <h3 className="font-medium mb-2">🌐 No Account Needed</h3>
                <p className="text-sm text-gray-400">Start chatting instantly, no signup required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Landing; 