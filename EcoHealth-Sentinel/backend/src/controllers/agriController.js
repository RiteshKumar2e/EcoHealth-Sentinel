export const getAgriDashboard = async (req, res, next) => {
    try {
        res.json({
            success: true,
            stats: {
                total_farms: 5,
                total_crops: 12,
                recent_detections: 3,
                active_schedules: 15
            },
            alerts: [
                { type: "warning", message: "Weather alert: Heavy rain expected", severity: "medium" }
            ]
        });
    } catch (error) {
        next(error);
    }
};

export const detectCropDisease = async (req, res, next) => {
    try {
        const diseases = [
            { name: "Late Blight", confidence: 0.92, severity: "High", recommendations: ["Apply fungicide", "Remove infected leaves"] },
            { name: "Healthy", confidence: 0.95, severity: "None", recommendations: ["Continue maintenance"] }
        ];
        res.json(diseases[Math.floor(Math.random() * diseases.length)]);
    } catch (error) {
        next(error);
    }
};

export const getMarketForecast = async (req, res, next) => {
    try {
        res.json({
            crop_type: req.query.crop_type || "General",
            trend: "increasing",
            forecast: [
                { date: new Date().toISOString().split('T')[0], predicted_price: 55.2, confidence: 0.88 }
            ]
        });
    } catch (error) {
        next(error);
    }
};
