# 🌒 ShadowChat Web

A browser-based, no-install chat platform designed for ultra-private, temporary conversations with stealth features and zero trace.

## 🎯 Core Mission

To give users a safe, anonymous place to chat without accounts, phone numbers, or risk of being monitored. Ideal for whistleblowers, teens avoiding parental control (👀), or just people who want true freedom online.

## 🧠 Key Features

### 1. 🗯️ Self-Destructing Messages
- Messages vanish after being read
- Configurable self-destruct timer (30s, 1m, 5m, 10m)
- Optional delay before showing messages

### 2. 🔑 Encrypted Chatrooms
- End-to-end AES encryption
- Room ID as encryption key
- Optional passphrase protection
- Server only relays encrypted messages

### 3. 🕵️ Stealth UI Modes
- "Calc Mode" - Switch to calculator UI (ESC key)
- "Boss Key" - Hide window instantly (F10)
- "Stealth Entry" - Secret keystroke to open chat

### 4. 🧼 No Logs. No Accounts. No Cookies
- No login required
- No tracking cookies
- Chat history never saved
- Anonymous ephemeral sessions

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shadowchat-web.git
cd shadowchat-web
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS
- **Encryption**: Web Crypto API (AES-256-GCM)
- **State Management**: React Hooks
- **Animations**: Framer Motion
- **Hotkeys**: react-hotkeys-hook

## 🔒 Security Features

- End-to-end encryption for all messages
- No message storage on server
- Self-destructing messages
- Stealth mode for privacy
- No user accounts or tracking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚠️ Disclaimer

This tool is designed for legitimate privacy needs. Users are responsible for using it in accordance with applicable laws and regulations. 
