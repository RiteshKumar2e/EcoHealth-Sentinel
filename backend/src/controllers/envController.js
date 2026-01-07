import { generateJSONResponse } from '../services/aiService.js';

export const getEnvDashboard = async (req, res, next) => {
    try {
        res.json({
            success: true,
            stats: {
                air_quality: 42,
                co2_avoided: 1250,
                waste_recycled: 85
            },
            alerts: [
                { type: "info", message: "Air quality is good today", severity: "low" }
            ]
        });
    } catch (error) {
        next(error);
    }
};

export const calculateCarbon = async (req, res, next) => {
    try {
        const { activity_type, value } = req.body;
        let factor = activity_type === 'travel' ? 0.2 : 0.5;
        const footprint = value * factor;

        const prompt = `A user performed a ${activity_type} activity worth ${value} units, resulting in ${footprint} kg CO2e. 
        Provide 3 specific, actionable recommendations to reduce this footprint.
        Return JSON: { "recommendations": string[] }`;

        const aiResponse = await generateJSONResponse(prompt);

        res.json({
            carbon_footprint: footprint,
            unit: "kg CO2e",
            recommendations: aiResponse.recommendations || ["Use public transport", "Plant a tree"]
        });
    } catch (error) {
        console.error('Env AI Error:', error);
        res.status(500).json({ success: false, error: 'AI Carbon advisor unavailable' });
    }
};
