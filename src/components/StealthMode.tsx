import React, { useState } from 'react';
import { motion } from 'framer-motion';

const StealthMode: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [isCalculating, setIsCalculating] = useState(false);

  const handleNumberClick = (num: number) => {
    if (display === '0') {
      setDisplay(num.toString());
    } else {
      setDisplay(display + num.toString());
    }
  };

  const handleOperation = (op: string) => {
    setDisplay(display + ' ' + op + ' ');
  };

  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(display);
      setDisplay(result.toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-100 p-4 flex items-center justify-center"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-right mb-4">
          <div className="text-3xl font-mono bg-gray-100 p-4 rounded">
            {display}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[7, 8, 9, '/', 4, 5, 6, '*', 1, 2, 3, '-', 0, '.', '=', '+'].map((item) => (
            <button
              key={item}
              onClick={() => {
                if (typeof item === 'number') {
                  handleNumberClick(item);
                } else if (item === '.') {
                  setDisplay(display.includes('.') ? display : display + '.');
                } else if (item === '=') {
                  handleCalculate();
                } else {
                  handleOperation(item);
                }
              }}
              className="bg-gray-200 hover:bg-gray-300 p-4 rounded text-xl font-medium transition-colors"
            >
              {item}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="col-span-4 bg-red-500 hover:bg-red-600 text-white p-4 rounded mt-2 transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Press ESC to exit stealth mode
        </div>
      </div>
    </motion.div>
  );
};

export default StealthMode; 