import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket Setup
const clients = new Set();
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

export const broadcast = (data) => {
  clients.forEach((client) => {
    if (client.readyState === 1) client.send(JSON.stringify(data));
  });
};

// Database and Server Start
const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 EcoHealth Sentinel Professional Server');
    console.log('='.repeat(60));
    console.log(`📡 HTTP Server: http://localhost:${PORT}`);
    console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
    console.log('='.repeat(60) + '\n');
  });
};

startServer();
