import express from 'express';
import { handleChat, getChatHistory } from '../controllers/chatbotController.js';
import { chatbotLimiter } from '../middlewares/rateLimiter.js';
import { validateChatMessage } from '../middlewares/validation.js';

const router = express.Router();

// Apply rate limiting to all chatbot routes
router.use(chatbotLimiter);

router.post('/', validateChatMessage, handleChat);
router.post('/:domain', validateChatMessage, handleChat);
router.get('/history', getChatHistory);

export default router;
