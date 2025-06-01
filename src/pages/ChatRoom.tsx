import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { encryptMessage, decryptMessage } from '../utils/encryption';
import { useHotkeys } from 'react-hotkeys-hook';
import QRCode from '../components/QRCode';
import { io, Socket } from 'socket.io-client';
import { useFirebaseUser, useUsername } from '../App';

interface Message {
  id: string;
  content: string;
  timestamp: number;
  selfDestructTime?: number;
  isRead: boolean;
  sender?: string;
}

const SOCKET_SERVER_URL = 'http://localhost:5000';

const ChatRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const user = useFirebaseUser();
  const { username, setUsername, logout } = useUsername();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selfDestructTime, setSelfDestructTime] = useState(30); // Default 30 seconds
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Show username modal if not set
  useEffect(() => {
    if (user && !username) {
      setShowUsernameModal(true);
    } else {
      setShowUsernameModal(false);
    }
  }, [user, username]);

  // Stealth mode hotkey
  useHotkeys('esc', () => {
    setIsStealthMode(!isStealthMode);
  });

  // Boss key hotkey
  useHotkeys('f10', () => {
    window.location.href = 'about:blank';
  });

  // Connect to Socket.IO server and join room
  useEffect(() => {
    if (!roomId) return;
    const socket = io(SOCKET_SERVER_URL, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.emit('join-room', roomId);

    socket.on('receive-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

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
    if (!newMessage.trim() || !roomId || !username) return;

    const encryptedContent = encryptMessage(newMessage, roomId);
    const message: Message = {
      id: Date.now().toString(),
      content: encryptedContent,
      timestamp: Date.now(),
      selfDestructTime: selfDestructTime * 1000,
      isRead: false,
      sender: username,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    // Send to server
    if (socketRef.current) {
      socketRef.current.emit('send-message', { roomId, message });
    }
  };

  const handleMessageRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  // Username modal logic
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUsername.trim()) return;
    await setUsername(tempUsername.trim());
    setShowUsernameModal(false);
    setTempUsername('');
  };

  if (showUsernameModal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-stealth-light p-8 rounded-lg shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Set your username</h2>
          <form onSubmit={handleUsernameSubmit} className="flex flex-col space-y-4">
            <input
              type="text"
              value={tempUsername}
              onChange={e => setTempUsername(e.target.value)}
              placeholder="Username"
              className="bg-stealth-dark text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Username
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

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
          <span className="text-blue-300 font-semibold">{username}</span>
          <button
            onClick={() => setShowUsernameModal(true)}
            className="text-sm text-blue-400 hover:underline"
          >
            Change Username
          </button>
          <button
            onClick={logout}
            className="text-sm text-red-400 hover:underline"
          >
            Logout
          </button>
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
              <div className="text-sm font-semibold text-blue-300 mb-1">
                {message.sender || 'Anonymous'}
              </div>
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
            disabled={!username}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!username}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom; 