require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const chatRoutes = require('./routes/chat');
const imageRoutes = require('./routes/image');
const dataRoutes = require('./routes/data');
const codeRoutes = require('./routes/code');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000' }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/code', codeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// WebSocket for real-time responses
io.on('connection', (socket) => {
  console.log('✓ Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('✗ Client disconnected:', socket.id);
  });
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Using Supabase: ${process.env.SUPABASE_URL}`);
});
