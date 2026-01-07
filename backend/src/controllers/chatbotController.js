import ChatMessage from '../models/ChatMessageMongo.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Domain-specific system prompts
const DOMAIN_PROMPTS = {
    agriculture: `You are AgriAI, an expert agricultural assistant who responds in Hindi and English mix (Hinglish).
Your expertise includes:
- Crop diseases and pest management (फसल रोग और कीट प्रबंधन)
- Irrigation and water management (सिंचाई)
- Soil health and fertilizers (मिट्टी स्वास्थ्य और उर्वरक)
- Weather and climate advice (मौसम सलाह)
- Market prices and selling tips (बाजार भाव)
- Farming techniques and best practices

IMPORTANT RULES:
- Respond primarily in Hindi with some English technical terms
- Be practical and farmer-friendly
- Provide actionable advice
- If asked about non-agricultural topics, politely redirect to farming
- Keep responses concise and helpful
- Use emojis like 🌾 🚜 💧 to make it engaging`,

    healthcare: `You are HealthAI, a professional medical assistant providing health guidance.
Your expertise includes:
- Symptom analysis and health assessment
- Appointment scheduling assistance
- Medication information and reminders
- Preventive healthcare tips
- Emergency guidance
- Vital signs interpretation
- General wellness advice

IMPORTANT RULES:
- Always remind users you're an AI, not a doctor
- For emergencies (chest pain, severe bleeding, etc.), immediately advise calling emergency services
- Provide evidence-based health information
- Be empathetic and professional
- Do NOT diagnose or prescribe medications
- Suggest consulting healthcare professionals for serious concerns
- Keep responses clear and medically accurate
- Use emojis like 🏥 💊 ❤️ appropriately`,

    environment: `You are EcoAI, an environmental conservation and sustainability expert.
Your expertise includes:
- Air quality monitoring and pollution control
- Climate change and weather patterns
- Waste management and recycling
- Renewable energy solutions
- Wildlife conservation
- Carbon footprint reduction
- Sustainable living practices
- Water conservation

IMPORTANT RULES:
- Provide scientifically accurate environmental information
- Encourage eco-friendly practices
- Be optimistic yet realistic about environmental challenges
- Offer practical, actionable sustainability tips
- If asked about non-environmental topics, redirect to eco-topics
- Keep responses informative and inspiring
- Use emojis like 🌍 ♻️ 🌱 to engage users`
};

// Helper function to get Gemini response
async function getGeminiResponse(message, domain) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('Gemini API key not configured');
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const systemPrompt = DOMAIN_PROMPTS[domain] || DOMAIN_PROMPTS.environment;
        const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}\n\nProvide a helpful, accurate response:`;

        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error('Gemini API Error:', error.message);

        // Fallback responses if Gemini fails
        const fallbackResponses = {
            agriculture: "🌾 Kshama karein, main abhi AI service se connect nahi ho pa raha. Kripya thodi der baad try karein. Aap mujhse crop diseases, irrigation, soil health, ya market prices ke baare mein pooch sakte hain.",
            healthcare: "🏥 I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment. I can help with symptoms, appointments, health monitoring, and wellness advice.",
            environment: "🌍 Sorry, I'm experiencing connectivity issues with my environmental database. Please try again shortly. I can assist with air quality, climate, waste management, and sustainability topics."
        };

        return fallbackResponses[domain] || fallbackResponses.environment;
    }
}

// Detect intent from message (for analytics)
function detectIntent(message, domain) {
    const msg = message.toLowerCase();

    if (domain === 'agriculture') {
        if (msg.includes('disease') || msg.includes('pest') || msg.includes('रोग') || msg.includes('बीमारी')) return 'crop_disease';
        if (msg.includes('water') || msg.includes('irrigation') || msg.includes('सिंचाई')) return 'irrigation';
        if (msg.includes('soil') || msg.includes('mitti') || msg.includes('मिट्टी')) return 'soil';
        if (msg.includes('fertilizer') || msg.includes('खाद') || msg.includes('उर्वरक')) return 'fertilizer';
        if (msg.includes('weather') || msg.includes('mausam') || msg.includes('मौसम')) return 'weather';
        if (msg.includes('price') || msg.includes('market') || msg.includes('बाजार')) return 'market';
        return 'general_agriculture';
    }

    if (domain === 'healthcare') {
        if (msg.includes('symptom') || msg.includes('feel') || msg.includes('pain')) return 'symptoms';
        if (msg.includes('appointment') || msg.includes('book') || msg.includes('doctor')) return 'appointment';
        if (msg.includes('emergency') || msg.includes('urgent')) return 'emergency';
        if (msg.includes('medicine') || msg.includes('drug') || msg.includes('medication')) return 'medication';
        if (msg.includes('monitor') || msg.includes('track') || msg.includes('blood')) return 'monitoring';
        return 'general_health';
    }

    if (domain === 'environment') {
        if (msg.includes('air') || msg.includes('aqi') || msg.includes('pollution')) return 'air_quality';
        if (msg.includes('climate') || msg.includes('weather') || msg.includes('temperature')) return 'climate';
        if (msg.includes('waste') || msg.includes('garbage') || msg.includes('recycle')) return 'waste';
        if (msg.includes('energy') || msg.includes('solar') || msg.includes('renewable')) return 'energy';
        if (msg.includes('wildlife') || msg.includes('animal') || msg.includes('conservation')) return 'conservation';
        return 'general_environment';
    }

    return 'general';
}

// Main chat handler
export const handleChat = async (req, res, next) => {
    try {
        const { message, sessionId, domain = 'general' } = req.body;

        // Validate domain
        const validDomains = ['agriculture', 'healthcare', 'environment'];
        if (!validDomains.includes(domain)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid domain. Must be: agriculture, healthcare, or environment'
            });
        }

        // Save user message
        await ChatMessage.create({
            text: message,
            sender: 'user',
            session_id: sessionId,
            domain
        });

        // Get AI response from Gemini
        const response = await getGeminiResponse(message, domain);

        // Detect intent for analytics
        const intent = detectIntent(message, domain);

        // Save bot response
        await ChatMessage.create({
            text: response,
            sender: 'bot',
            session_id: sessionId,
            domain,
            intent
        });

        res.json({
            success: true,
            response,
            domain,
            intent
        });
    } catch (error) {
        console.error('Chat error:', error);
        next(error);
    }
};

// Get chat history
export const getChatHistory = async (req, res, next) => {
    try {
        const { sessionId, domain } = req.query;

        const query = {};
        if (sessionId) query.session_id = sessionId;
        if (domain) query.domain = domain;

        const messages = await ChatMessage.find(query)
            .sort({ createdAt: 1 })
            .limit(100);

        res.json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};
