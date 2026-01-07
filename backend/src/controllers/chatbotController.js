import ChatMessage from '../models/ChatMessage.js';
import { Op } from 'sequelize';

// Domain-specific knowledge bases
const AGRICULTURE_KNOWLEDGE = {
    keywords: ['crop', 'farm', 'soil', 'irrigation', 'pest', 'fertilizer', 'harvest', 'seed', 'agriculture', 'farming', 'wheat', 'rice', 'corn', 'vegetable', 'fruit', 'disease', 'yield', 'tractor', 'plow', 'cultivate'],
    responses: {
        greeting: "Namaste! Main AgriAI hoon. Main aapki farming aur crop management mein madad kar sakta hoon. Aap mujhse crop diseases, irrigation, soil health, ya farming techniques ke baare mein pooch sakte hain.",
        crop_disease: "Crop diseases ki pehchaan ke liye, mujhe batayein:\n• Kaun si fasal hai?\n• Patte/paudhe ka color kaisa hai?\n• Koi spots ya patches hain?\n\nMain AI-powered disease detection se aapki madad karunga.",
        irrigation: "Irrigation schedule ke liye:\n• Soil moisture level check karein\n• Weather forecast dekhein\n• Crop type ke hisaab se pani dein\n\nSmart irrigation se 30-40% pani bachta hai!",
        soil: "Soil health improve karne ke liye:\n• Regular soil testing karwayein\n• Organic matter add karein\n• Crop rotation practice karein\n• pH level maintain karein (6.0-7.5)",
        fertilizer: "Fertilizer application:\n• NPK ratio crop ke hisaab se choose karein\n• Organic fertilizers prefer karein\n• Over-fertilization se bachein\n• Soil test ke baad hi apply karein",
        weather: "Weather updates aur farming tips:\n• Monsoon prediction\n• Temperature alerts\n• Frost warnings\n• Best sowing time recommendations",
        market: "Market prices aur selling tips:\n• Current mandi rates\n• Best selling time\n• Storage techniques\n• Government schemes",
        default: "Main agriculture aur farming se related sawaalon ka jawab de sakta hoon. Aap mujhse crop diseases, irrigation, soil health, fertilizers, weather updates, ya market prices ke baare mein pooch sakte hain."
    }
};

const HEALTHCARE_KNOWLEDGE = {
    keywords: ['health', 'doctor', 'medicine', 'symptom', 'disease', 'hospital', 'appointment', 'patient', 'treatment', 'diagnosis', 'fever', 'pain', 'cough', 'cold', 'headache', 'blood', 'pressure', 'diabetes', 'heart'],
    responses: {
        greeting: "Hello! I'm HealthAI, your medical assistant. I can help with symptom checking, appointment booking, health monitoring, and medical information. How can I assist you today?",
        symptoms: "For symptom checking, please tell me:\n• What symptoms are you experiencing?\n• How long have you had them?\n• Any other relevant health conditions?\n\nNote: This is not a substitute for professional medical advice.",
        appointment: "To book an appointment:\n• Select your preferred doctor/specialist\n• Choose date and time\n• Provide your contact details\n\nI can also check doctor availability and suggest the best time slots.",
        emergency: "🚨 EMERGENCY SERVICES:\n• Ambulance: 102\n• Emergency Helpline: 108\n• Nearest Hospital Locator available\n\nFor life-threatening conditions, please call emergency services immediately!",
        medication: "Medication information:\n• Dosage guidelines\n• Side effects\n• Drug interactions\n• Prescription reminders\n\n⚠️ Always consult your doctor before taking any medication.",
        monitoring: "Health monitoring features:\n• Blood pressure tracking\n• Blood sugar levels\n• Heart rate monitoring\n• Medication reminders\n• Health reports",
        prevention: "Preventive healthcare tips:\n• Regular health checkups\n• Balanced diet\n• Regular exercise\n• Adequate sleep (7-8 hours)\n• Stress management",
        default: "I can help with health-related queries including symptoms, appointments, medications, health monitoring, and preventive care. What would you like to know?"
    }
};

const ENVIRONMENT_KNOWLEDGE = {
    keywords: ['environment', 'pollution', 'air', 'water', 'climate', 'weather', 'temperature', 'carbon', 'waste', 'recycle', 'energy', 'renewable', 'solar', 'wind', 'tree', 'forest', 'wildlife', 'conservation', 'eco', 'green'],
    responses: {
        greeting: "Hello! I'm EcoAI, your environmental assistant. I can help with air quality monitoring, climate predictions, waste management, renewable energy, and wildlife conservation. How can I help you today?",
        air_quality: "Air Quality Information:\n• Real-time AQI monitoring\n• Pollution levels in your area\n• Health recommendations\n• Pollution sources identification\n\nCurrent AQI categories:\n• 0-50: Good\n• 51-100: Moderate\n• 101-200: Unhealthy\n• 201+: Very Unhealthy",
        climate: "Climate & Weather Services:\n• 7-day weather forecast\n• Temperature trends\n• Rainfall predictions\n• Climate change impact analysis\n• Disaster warnings",
        waste: "Waste Management Tips:\n• Segregate waste (wet/dry/hazardous)\n• Composting organic waste\n• Recycling guidelines\n• E-waste disposal\n• Reduce, Reuse, Recycle",
        energy: "Renewable Energy Information:\n• Solar panel installation\n• Wind energy potential\n• Energy consumption tracking\n• Carbon footprint calculation\n• Cost savings estimation",
        conservation: "Wildlife & Conservation:\n• Species tracking\n• Habitat protection\n• Endangered species info\n• Conservation projects\n• How to contribute",
        carbon: "Carbon Footprint:\n• Calculate your emissions\n• Reduction strategies\n• Offset programs\n• Sustainable lifestyle tips\n• Green transportation",
        default: "I can help with environmental queries including air quality, climate predictions, waste management, renewable energy, and wildlife conservation. What would you like to know?"
    }
};

// Helper function to detect intent
function detectIntent(message, domain) {
    const msg = message.toLowerCase();

    if (domain === 'agriculture') {
        if (msg.includes('disease') || msg.includes('pest') || msg.includes('infection')) return 'crop_disease';
        if (msg.includes('water') || msg.includes('irrigation') || msg.includes('drip')) return 'irrigation';
        if (msg.includes('soil') || msg.includes('mitti') || msg.includes('khad')) return 'soil';
        if (msg.includes('fertilizer') || msg.includes('manure') || msg.includes('npk')) return 'fertilizer';
        if (msg.includes('weather') || msg.includes('mausam') || msg.includes('rain')) return 'weather';
        if (msg.includes('price') || msg.includes('market') || msg.includes('mandi')) return 'market';
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('namaste')) return 'greeting';
        return 'default';
    }

    if (domain === 'healthcare') {
        if (msg.includes('symptom') || msg.includes('feel') || msg.includes('pain') || msg.includes('fever')) return 'symptoms';
        if (msg.includes('appointment') || msg.includes('book') || msg.includes('doctor')) return 'appointment';
        if (msg.includes('emergency') || msg.includes('urgent') || msg.includes('ambulance')) return 'emergency';
        if (msg.includes('medicine') || msg.includes('drug') || msg.includes('medication')) return 'medication';
        if (msg.includes('monitor') || msg.includes('track') || msg.includes('blood')) return 'monitoring';
        if (msg.includes('prevent') || msg.includes('healthy') || msg.includes('wellness')) return 'prevention';
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) return 'greeting';
        return 'default';
    }

    if (domain === 'environment') {
        if (msg.includes('air') || msg.includes('aqi') || msg.includes('pollution')) return 'air_quality';
        if (msg.includes('climate') || msg.includes('weather') || msg.includes('temperature')) return 'climate';
        if (msg.includes('waste') || msg.includes('garbage') || msg.includes('recycle')) return 'waste';
        if (msg.includes('energy') || msg.includes('solar') || msg.includes('renewable')) return 'energy';
        if (msg.includes('wildlife') || msg.includes('animal') || msg.includes('conservation')) return 'conservation';
        if (msg.includes('carbon') || msg.includes('emission') || msg.includes('footprint')) return 'carbon';
        if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) return 'greeting';
        return 'default';
    }

    return 'default';
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

        // Get domain-specific knowledge
        let knowledge, response;

        if (domain === 'agriculture') {
            knowledge = AGRICULTURE_KNOWLEDGE;
        } else if (domain === 'healthcare') {
            knowledge = HEALTHCARE_KNOWLEDGE;
        } else if (domain === 'environment') {
            knowledge = ENVIRONMENT_KNOWLEDGE;
        }

        // Detect intent and get response
        const intent = detectIntent(message, domain);
        response = knowledge.responses[intent] || knowledge.responses.default;

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
        next(error);
    }
};

// Get chat history
export const getChatHistory = async (req, res, next) => {
    try {
        const { sessionId, domain } = req.query;

        const where = {};
        if (sessionId) where.session_id = sessionId;
        if (domain) where.domain = domain;

        const messages = await ChatMessage.findAll({
            where,
            order: [['created_at', 'ASC']],
            limit: 100
        });

        res.json({ success: true, messages });
    } catch (error) {
        next(error);
    }
};
