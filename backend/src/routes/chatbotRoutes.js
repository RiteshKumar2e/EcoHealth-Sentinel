import express from 'express';
import { handleChat, getChatHistory } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/', handleChat);
router.post('/:domain', handleChat);
router.get('/history', getChatHistory);

export default router;
