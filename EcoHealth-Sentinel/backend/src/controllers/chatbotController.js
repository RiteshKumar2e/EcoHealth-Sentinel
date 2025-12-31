import ChatMessage from '../models/ChatMessage.js';

export const handleChat = async (req, res, next) => {
    try {
        const { message, sessionId, domain = 'general' } = req.body;

        const userMsg = new ChatMessage({ text: message, sender: 'user', sessionId, domain });
        await userMsg.save();

        let response = "I'm EcoHealth AI. How can I assist you with health, environment, or agriculture?";

        const msg = message.toLowerCase();
        if (domain === 'healthcare' || msg.includes('health') || msg.includes('doctor')) {
            response = "I can help with appointment scheduling, symptom checking, and medical information. Would you like to check some symptoms?";
        } else if (domain === 'agriculture' || msg.includes('crop') || msg.includes('farm')) {
            response = "I can provide crop disease detection and irrigation schedules. How is your farm doing today?";
        } else if (domain === 'environment' || msg.includes('weather') || msg.includes('pollution')) {
            response = "I monitor air quality and environmental risks. Is there a specific area you're concerned about?";
        }

        const botMsg = new ChatMessage({ text: response, sender: 'bot', sessionId, domain });
        await botMsg.save();

        res.json({ success: true, response });
    } catch (error) {
        next(error);
    }
};
