import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import EmergencyMetrics from './src/models/EmergencyMetrics.js';

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

  // Start auto-updates (from previous logic)
  startAutoUpdates();
};

function startAutoUpdates() {
  setInterval(async () => {
    try {
      const lastMetrics = await EmergencyMetrics.findOne().sort({ timestamp: -1 });
      if (lastMetrics) {
        const updatedMetrics = new EmergencyMetrics({
          currentLoad: Math.max(10, Math.min(50, lastMetrics.currentLoad + Math.floor(Math.random() * 7) - 3)),
          predictedPeak: Math.max(30, Math.min(60, lastMetrics.predictedPeak + Math.floor(Math.random() * 5) - 2)),
          avgResponseTime: Math.max(5, Math.min(15, parseFloat((lastMetrics.avgResponseTime + (Math.random() * 2 - 1)).toFixed(1)))),
          bedAvailability: Math.max(50, Math.min(95, lastMetrics.bedAvailability + Math.floor(Math.random() * 5) - 2)),
        });
        await updatedMetrics.save();
        broadcast({ type: 'metrics_update', data: updatedMetrics });
      }
    } catch (error) {
      // Ignore background errors
    }
  }, 10000);
}

startServer();
