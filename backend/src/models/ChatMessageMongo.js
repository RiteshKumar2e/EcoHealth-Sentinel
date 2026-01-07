import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1000
    },
    sender: {
        type: String,
        enum: ['user', 'bot'],
        required: true,
        default: 'user'
    },
    session_id: {
        type: String,
        index: true
    },
    domain: {
        type: String,
        enum: ['agriculture', 'healthcare', 'environment', 'general'],
        required: true,
        default: 'general',
        index: true
    },
    intent: {
        type: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Compound index for better query performance
chatMessageSchema.index({ session_id: 1, domain: 1 });
chatMessageSchema.index({ createdAt: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
