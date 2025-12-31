import DiseaseDetection from '../../EcoHealth-Sentinel/backend/src/models/DiseaseDetection.js';
import IrrigationLegacy from '../../EcoHealth-Sentinel/backend/src/models/IrrigationLegacy.js';

export const getAgriDashboard = async (req, res, next) => {
    try {
        const today = new Date();
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);

        const recentDetections = await DiseaseDetection.countDocuments({
            detected_at: { $gte: lastWeek }
        });

        const recentActivity = await DiseaseDetection.find().sort({ detected_at: -1 }).limit(5);

        res.json({
            success: true,
            stats: {
                total_farms: 5,
                total_crops: 12,
                recent_detections: recentDetections,
                active_schedules: 15
            },
            recent_activity: recentActivity,
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
            { name: "Leaf Rust", confidence: 0.85, severity: "Medium", recommendations: ["Apply fungicide", "Monitor spread"] },
            { name: "Healthy", confidence: 0.95, severity: "None", recommendations: ["Continue maintenance"] }
        ];

        const detected = diseases[Math.floor(Math.random() * diseases.length)];

        const detection = new DiseaseDetection({
            disease_name: detected.name,
            confidence: detected.confidence,
            severity: detected.severity,
            image_name: req.file ? req.file.filename : 'unknown.jpg'
        });
        await detection.save();

        res.json(detected);
    } catch (error) {
        next(error);
    }
};

export const getMarketForecast = async (req, res, next) => {
    try {
        const { crop_type, days = 7 } = req.query;
        const basePrice = 50;
        const forecastData = [];

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const price = basePrice + (Math.random() * 15 - 5);
            forecastData.push({
                date: date.toISOString().split('T')[0],
                predicted_price: parseFloat(price.toFixed(2)),
                confidence: parseFloat((0.75 + Math.random() * 0.2).toFixed(2))
            });
        }

        res.json({
            crop_type: crop_type || "General",
            forecast_period: `${days} days`,
            forecast: forecastData,
            trend: "increasing",
            recommendations: [
                "Consider selling in the next 5-7 days for optimal prices",
                "Monitor market trends daily"
            ]
        });
    } catch (error) {
        next(error);
    }
};

export const createIrrigationSchedule = async (req, res, next) => {
    try {
        const { farm_id, crop_type, area_size, soil_type } = req.body;

        // This would typically save to an IrrigationSchedule model
        // For now returning simulated data as per requirement
        const irrigationPlan = {
            farm_id,
            crop_type,
            area_size,
            soil_type,
            schedule: [
                { day: "Monday", time: "06:00", duration_minutes: 30, water_amount_liters: 500 },
                { day: "Wednesday", time: "06:00", duration_minutes: 30, water_amount_liters: 500 },
                { day: "Friday", time: "06:00", duration_minutes: 30, water_amount_liters: 500 }
            ],
            total_weekly_water: 1500,
            active: true
        };

        res.json({
            success: true,
            schedule: irrigationPlan.schedule,
            recommendations: [
                "Adjust schedule based on rainfall",
                "Monitor soil moisture levels"
            ]
        });
    } catch (error) {
        next(error);
    }
};

export const getFertilizerRecommendations = async (req, res, next) => {
    try {
        const { crop_type, area_size } = req.body;

        res.json({
            crop_type,
            recommended_fertilizers: [
                { name: "NPK 20-20-20", quantity_kg: area_size * 0.5, frequency: "Every 2 weeks" },
                { name: "Organic Compost", quantity_kg: area_size * 2, frequency: "Monthly" }
            ],
            estimated_cost: area_size * 150
        });
    } catch (error) {
        next(error);
    }
};

export const getPestControl = async (req, res, next) => {
    try {
        const { crop_type, pest_type } = req.body;

        res.json({
            crop_type,
            identified_pests: [
                {
                    name: pest_type || "Aphids",
                    severity: "Medium",
                    control_methods: ["Neem oil spray", "Ladybugs"]
                }
            ],
            organic_solutions: ["Neem oil", "Garlic spray"],
            chemical_solutions: [{ name: "Imidacloprid", dosage: "0.5ml per liter" }]
        });
    } catch (error) {
        next(error);
    }
};

export const getWeatherForecast = async (req, res, next) => {
    try {
        const { location, days = 7 } = req.query;
        const forecast = [];
        const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"];

        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            forecast.push({
                date: date.toISOString().split('T')[0],
                temperature: {
                    min: Math.floor(20 + Math.random() * 5),
                    max: Math.floor(28 + Math.random() * 7)
                },
                humidity: Math.floor(60 + Math.random() * 25),
                condition: conditions[Math.floor(Math.random() * conditions.length)]
            });
        }

        res.json({
            location: location || "Current Location",
            forecast,
            alerts: [{ type: "info", message: "Favorable conditions for irrigation" }]
        });
    } catch (error) {
        next(error);
    }
};
