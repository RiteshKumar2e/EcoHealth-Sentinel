import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { requestLogger } from './middlewares/loggerMiddleware.js';
import { errorHandler, notFoundHandler } from './middlewares/errorMiddleware.js';

// Import Routes
import adminRoutes from './routes/adminRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import healthcareRoutes from './routes/healthcareRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import agriRoutes from './routes/agriRoutes.js';
import envRoutes from './routes/envRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: '*', // Adjust for production
    credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'EcoHealth Sentinel API - Professional Node.js Backend',
        status: 'running',
        version: '2.0.0'
    });
});

app.use('/api/admin', adminRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/agriculture', agriRoutes);
app.use('/api/environment', envRoutes);
app.use('/api/auth', authRoutes);

// Keep legacy routes compatibility if needed
app.use('/api', emergencyRoutes); // Default to emergency for root /api calls if any

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
