import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    text: String,
    sender: String,
    timestamp: { type: Date, default: Date.now },
    sessionId: String,
    domain: { type: String, default: 'general' }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
export default ChatMessage;
