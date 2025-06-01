const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });

  // Relay encrypted messages
  socket.on('send-message', ({ roomId, message }) => {
    // Broadcast to everyone else in the room
    socket.to(roomId).emit('receive-message', message);
  });

  // Optional: handle disconnects
  socket.on('disconnect', () => {
    // No action needed for privacy
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`ShadowChat Socket.IO server running on port ${PORT}`);
}); 