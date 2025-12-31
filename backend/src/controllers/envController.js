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
        res.json({
            carbon_footprint: value * factor,
            unit: "kg CO2e",
            recommendations: ["Use public transport", "Plant a tree"]
        });
    } catch (error) {
        next(error);
    }
};
