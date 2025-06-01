import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

interface QRCodeProps {
  roomId: string;
  className?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ roomId, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const roomUrl = `${window.location.origin}/room/${roomId}`;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
      >
        <span>📱 Share Room</span>
        <span className="text-sm">(QR Code)</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 p-4 bg-stealth-light rounded-lg shadow-lg z-50"
          >
            <div className="flex flex-col items-center space-y-4">
              <QRCodeSVG
                value={roomUrl}
                size={200}
                level="H"
                includeMargin
                className="bg-white p-2 rounded-lg"
              />
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">Scan to join room</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={roomUrl}
                    readOnly
                    className="bg-stealth-dark text-white text-sm px-3 py-1 rounded"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(roomUrl);
                      alert('Room link copied to clipboard!');
                    }}
                    className="text-blue-500 hover:text-blue-400 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRCode; 