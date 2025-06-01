import CryptoJS from 'crypto-js';

export const generateRoomId = (): string => {
  const randomBytes = CryptoJS.lib.WordArray.random(16);
  return randomBytes.toString(CryptoJS.enc.Hex);
};

export const encryptMessage = (message: string, key: string): string => {
  return CryptoJS.AES.encrypt(message, key).toString();
};

export const decryptMessage = (encryptedMessage: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const generatePassphrase = (): string => {
  const words = [
    'shadow', 'stealth', 'ghost', 'phantom', 'cipher',
    'crypt', 'vault', 'secure', 'private', 'hidden'
  ];
  const randomWords = Array.from({ length: 3 }, () => 
    words[Math.floor(Math.random() * words.length)]
  );
  return randomWords.join('-');
};

export const hashRoomId = (roomId: string): string => {
  return CryptoJS.SHA256(roomId).toString(CryptoJS.enc.Hex);
};

export const validateRoomId = (roomId: string): boolean => {
  return /^[a-f0-9]{32}$/.test(roomId);
}; 