import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import { useHotkeys } from 'react-hotkeys-hook';
import QRCode from '../components/QRCode';

interface Message {
  id: string;
  content: string;
  timestamp: number;
  selfDestructTime?: number;
  isRead: boolean;
}

const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selfDestructTime, setSelfDestructTime] = useState(30); // Default 30 seconds
  const [isStealthMode, setIsStealthMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Stealth mode hotkey
  useHotkeys('esc', () => {
    setIsStealthMode(!isStealthMode);
  });

  // Boss key hotkey
  useHotkeys('f10', () => {
    window.location.href = 'about:blank';
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clean up messages that have self-destructed
    const cleanupInterval = setInterval(() => {
      setMessages(prevMessages => 
        prevMessages.filter(msg => 
          !msg.selfDestructTime || 
          Date.now() - msg.timestamp < msg.selfDestructTime
        )
      );
    }, 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const encryptedContent = encryptMessage(newMessage, roomId!);
    const message: Message = {
      id: Date.now().toString(),
      content: encryptedContent,
      timestamp: Date.now(),
      selfDestructTime: selfDestructTime * 1000,
      isRead: false,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleMessageRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  if (isStealthMode) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Calculator</h2>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
              <button
                key={num}
                className="bg-gray-200 p-4 rounded hover:bg-gray-300"
                onClick={() => setIsStealthMode(false)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stealth-dark flex flex-col">
      <header className="bg-stealth-light p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">ShadowChat Room</h1>
        <div className="flex items-center space-x-4">
          <QRCode roomId={roomId!} />
          <select
            value={selfDestructTime}
            onChange={(e) => setSelfDestructTime(Number(e.target.value))}
            className="bg-stealth-dark text-white rounded px-2 py-1"
          >
            <option value={30}>30s</option>
            <option value={60}>1m</option>
            <option value={300}>5m</option>
            <option value={600}>10m</option>
          </select>
          <button
            onClick={() => setIsStealthMode(true)}
            className="text-gray-400 hover:text-white"
          >
            🕵️ Stealth Mode
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stealth-light rounded-lg p-4 max-w-[80%]"
              onMouseEnter={() => handleMessageRead(message.id)}
            >
              <p className="text-white">
                {decryptMessage(message.content, roomId!)}
              </p>
              <div className="text-xs text-gray-400 mt-2">
                {message.selfDestructTime && (
                  <span>
                    Self-destructs in{' '}
                    {Math.ceil(
                      (message.selfDestructTime - (Date.now() - message.timestamp)) / 1000
                    )}{' '}
                    seconds
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-stealth-light">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-stealth-dark text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom; 