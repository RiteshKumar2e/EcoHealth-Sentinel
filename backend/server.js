// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/emergency_prediction', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const emergencyMetricsSchema = new mongoose.Schema({
  currentLoad: Number,
  predictedPeak: Number,
  avgResponseTime: Number,
  bedAvailability: Number,
  timestamp: { type: Date, default: Date.now },
});

const predictionSchema = new mongoose.Schema({
  type: String,
  riskLevel: String,
  probability: Number,
  timeframe: String,
  factors: [String],
  recommendedAction: String,
  confidence: Number,
  affectedArea: String,
  estimatedCases: String,
  timestamp: { type: Date, default: Date.now },
});

const historicalDataSchema = new mongoose.Schema({
  hour: String,
  actual: Number,
  predicted: Number,
  capacity: Number,
  x: Number,
  y: Number,
  date: { type: Date, default: Date.now },
});

const categoryDataSchema = new mongoose.Schema({
  category: String,
  current: Number,
  predicted: Number,
  timestamp: { type: Date, default: Date.now },
});

const resourceDataSchema = new mongoose.Schema({
  resource: String,
  current: Number,
  predicted: Number,
  capacity: Number,
  timestamp: { type: Date, default: Date.now },
});

const chatMessageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  timestamp: { type: Date, default: Date.now },
  sessionId: String,
});

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  priority: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

// Models
const EmergencyMetrics = mongoose.model('EmergencyMetrics', emergencyMetricsSchema);
const Prediction = mongoose.model('Prediction', predictionSchema);
const HistoricalData = mongoose.model('HistoricalData', historicalDataSchema);
const CategoryData = mongoose.model('CategoryData', categoryDataSchema);
const ResourceData = mongoose.model('ResourceData', resourceDataSchema);
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
const Notification = mongoose.model('Notification', notificationSchema);

// WebSocket connections
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New WebSocket connection');

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Broadcast to all connected clients
function broadcast(data) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// API Routes

// Get Emergency Metrics
app.get('/api/metrics', async (req, res) => {
  try {
    const metrics = await EmergencyMetrics.findOne().sort({ timestamp: -1 });
    res.json(metrics || {
      currentLoad: 23,
      predictedPeak: 45,
      avgResponseTime: 8.5,
      bedAvailability: 76,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Emergency Metrics
app.post('/api/metrics', async (req, res) => {
  try {
    const metrics = new EmergencyMetrics(req.body);
    await metrics.save();
    
    // Broadcast to WebSocket clients
    broadcast({ type: 'metrics_update', data: metrics });
    
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Predictions
app.get('/api/predictions', async (req, res) => {
  try {
    const { timeframe, riskLevel } = req.query;
    let query = {};
    
    if (riskLevel && riskLevel !== 'all') {
      query.riskLevel = riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1);
    }
    
    const predictions = await Prediction.find(query)
      .sort({ timestamp: -1 })
      .limit(10);
    
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Prediction
app.post('/api/predictions', async (req, res) => {
  try {
    const prediction = new Prediction(req.body);
    await prediction.save();
    
    // Broadcast to WebSocket clients
    broadcast({ type: 'prediction_update', data: prediction });
    
    // Create notification for high-risk predictions
    if (prediction.riskLevel === 'High' && prediction.probability > 75) {
      const notification = new Notification({
        title: 'High Risk Alert',
        message: `${prediction.type} predicted with ${prediction.probability}% probability`,
        priority: 'high',
      });
      await notification.save();
      broadcast({ type: 'notification', data: notification });
    }
    
    res.json(prediction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Historical Data
app.get('/api/historical', async (req, res) => {
  try {
    const { timeframe } = req.query;
    let hours = 24;
    
    if (timeframe === '48h') hours = 48;
    if (timeframe === '7d') hours = 168;
    
    const data = await HistoricalData.find()
      .sort({ timestamp: -1 })
      .limit(hours);
    
    res.json(data.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Historical Data
app.post('/api/historical', async (req, res) => {
  try {
    const data = new HistoricalData(req.body);
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Category Data
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await CategoryData.find().sort({ timestamp: -1 }).limit(5);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Category Data
app.post('/api/categories', async (req, res) => {
  try {
    const category = new CategoryData(req.body);
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Resource Data
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await ResourceData.find().sort({ timestamp: -1 }).limit(5);
    res.json(resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Resource Data
app.post('/api/resources', async (req, res) => {
  try {
    const resource = new ResourceData(req.body);
    await resource.save();
    broadcast({ type: 'resource_update', data: resource });
    res.json(resource);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat AI Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    // Save user message
    const userMessage = new ChatMessage({
      text: message,
      sender: 'user',
      sessionId,
    });
    await userMessage.save();
    
    // AI Response Logic (Simple keyword-based responses)
    let response = 'I can help you with emergency predictions, resource allocation, and risk assessment. What would you like to know?';
    
    if (message.toLowerCase().includes('load') || message.toLowerCase().includes('patient')) {
      const metrics = await EmergencyMetrics.findOne().sort({ timestamp: -1 });
      response = `Current emergency load is ${metrics.currentLoad} patients with ${metrics.bedAvailability}% bed availability. Predicted peak is ${metrics.predictedPeak} patients.`;
    } else if (message.toLowerCase().includes('risk') || message.toLowerCase().includes('high')) {
      const highRiskPredictions = await Prediction.find({ riskLevel: 'High' }).sort({ timestamp: -1 }).limit(1);
      if (highRiskPredictions.length > 0) {
        const pred = highRiskPredictions[0];
        response = `High-risk alert: ${pred.type} predicted with ${pred.probability}% probability in ${pred.timeframe}. Recommended action: ${pred.recommendedAction}`;
      }
    } else if (message.toLowerCase().includes('resource')) {
      const resources = await ResourceData.find().sort({ timestamp: -1 }).limit(3);
      response = `Resource status: ${resources.map(r => `${r.resource} at ${r.current}%`).join(', ')}. Predicted utilization may increase.`;
    }
    
    // Save bot response
    const botMessage = new ChatMessage({
      text: response,
      sender: 'bot',
      sessionId,
    });
    await botMessage.save();
    
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Chat History
app.get('/api/chat/:sessionId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ sessionId: req.params.sessionId })
      .sort({ timestamp: 1 })
      .limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Notifications
app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({ read: false })
      .sort({ timestamp: -1 })
      .limit(10);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark Notification as Read
app.patch('/api/notifications/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute Action
app.post('/api/actions/execute', async (req, res) => {
  try {
    const { predictionId, action } = req.body;
    
    const notification = new Notification({
      title: 'Action Executed',
      message: `Protocol activated: ${action}`,
      priority: 'info',
    });
    await notification.save();
    
    broadcast({ type: 'action_executed', data: { predictionId, action } });
    
    res.json({ success: true, message: 'Action executed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notify Team
app.post('/api/actions/notify', async (req, res) => {
  try {
    const { predictionId, message } = req.body;
    
    const notification = new Notification({
      title: 'Team Notification',
      message: message,
      priority: 'medium',
    });
    await notification.save();
    
    broadcast({ type: 'team_notified', data: { predictionId, message } });
    
    res.json({ success: true, message: 'Team notified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export Data
app.get('/api/export', async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ timestamp: -1 }).limit(100);
    const metrics = await EmergencyMetrics.find().sort({ timestamp: -1 }).limit(100);
    
    const exportData = {
      predictions,
      metrics,
      exportDate: new Date(),
    };
    
    res.json(exportData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed Database (For testing)
app.post('/api/seed', async (req, res) => {
  try {
    // Seed predictions
    const predictions = [
      {
        type: 'Cardiac Emergency',
        riskLevel: 'High',
        probability: 78,
        timeframe: '4-6 hours',
        factors: ['Chest pain pattern', 'Age demographics', 'Historical data', 'Weather conditions'],
        recommendedAction: 'Increase cardiology staff by 2, prepare cath lab',
        confidence: 92,
        affectedArea: 'Downtown District',
        estimatedCases: '8-12 patients',
      },
      {
        type: 'Respiratory Distress',
        riskLevel: 'Medium',
        probability: 65,
        timeframe: '6-12 hours',
        factors: ['Air quality index', 'Seasonal patterns', 'COVID-19 trends'],
        recommendedAction: 'Stock respiratory supplies, alert pulmonology team',
        confidence: 87,
        affectedArea: 'Industrial Zone',
        estimatedCases: '12-18 patients',
      },
    ];
    
    await Prediction.insertMany(predictions);
    
    // Seed metrics
    const metrics = {
      currentLoad: 23,
      predictedPeak: 45,
      avgResponseTime: 8.5,
      bedAvailability: 76,
    };
    
    await EmergencyMetrics.create(metrics);
    
    // Seed historical data
    const historical = [];
    for (let i = 0; i < 24; i++) {
      historical.push({
        hour: `${i.toString().padStart(2, '0')}:00`,
        actual: Math.floor(Math.random() * 30) + 10,
        predicted: Math.floor(Math.random() * 30) + 12,
        capacity: 50,
        x: i,
        y: Math.floor(Math.random() * 30) + 10,
      });
    }
    
    await HistoricalData.insertMany(historical);
    
    // Seed categories
    const categories = [
      { category: 'Cardiac', current: 8, predicted: 12 },
      { category: 'Trauma', current: 6, predicted: 8 },
      { category: 'Respiratory', current: 5, predicted: 9 },
      { category: 'Neurological', current: 3, predicted: 5 },
      { category: 'Other', current: 4, predicted: 6 },
    ];
    
    await CategoryData.insertMany(categories);
    
    // Seed resources
    const resources = [
      { resource: 'ER Beds', current: 65, predicted: 82, capacity: 100 },
      { resource: 'ICU Beds', current: 78, predicted: 88, capacity: 100 },
      { resource: 'Ventilators', current: 45, predicted: 62, capacity: 100 },
      { resource: 'Physicians', current: 70, predicted: 85, capacity: 100 },
      { resource: 'Nurses', current: 72, predicted: 90, capacity: 100 },
    ];
    
    await ResourceData.insertMany(resources);
    
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-update metrics every 5 seconds (simulating real-time updates)
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
    console.error('Auto-update error:', error);
  }
}, 5000);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
