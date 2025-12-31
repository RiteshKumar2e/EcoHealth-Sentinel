import CarbonCalculation from '../../EcoHealth-Sentinel/backend/src/models/CarbonCalculation.js';
import DisasterPrediction from '../../EcoHealth-Sentinel/backend/src/models/DisasterPrediction.js';
import WasteLog from '../../EcoHealth-Sentinel/backend/src/models/WasteLog.js';

export const getEnvDashboard = async (req, res, next) => {
    try {
        res.json({
            success: true,
            stats: {
                air_quality_index: 85,
                carbon_footprint_today: 1250,
                renewable_energy_usage: 45.5,
                waste_recycled_today: 320,
                pollution_hotspots: 8
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
        const { activity_type, value, unit } = req.body;

        const emissionFactors = {
            electricity: 0.5,
            gasoline: 2.3,
            natural_gas: 2.0,
            flight: 90,
            car: 0.12,
            public_transport: 0.04
        };

        const factor = emissionFactors[activity_type?.toLowerCase()] || 1.0;
        const carbonEmission = value * factor;

        const result = {
            activity: activity_type,
            input_value: value,
            unit: unit,
            carbon_emission_kg: parseFloat(carbonEmission.toFixed(2)),
            carbon_emission_tons: parseFloat((carbonEmission / 1000).toFixed(4)),
            trees_to_offset: parseFloat((carbonEmission / 21).toFixed(1)),
            recommendations: [
                "Consider using renewable energy sources",
                "Reduce consumption where possible",
                "Offset with tree planting"
            ]
        };

        const calculation = new CarbonCalculation({
            activity_type,
            value,
            unit,
            result
        });
        await calculation.save();

        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const getClimatePredictions = async (req, res, next) => {
    try {
        const { location } = req.query;
        res.json({
            location: location || "Global",
            predictions: {
                "1_month": { temperature_change: "+0.5°C", precipitation: "above average" },
                "1_year": { temperature_change: "+1.8°C", extreme_events: "high probability" }
            },
            climate_risks: [
                { risk: "Heat waves", probability: "high" },
                { risk: "Flooding", probability: "low" }
            ]
        });
    } catch (error) {
        next(error);
    }
};

export const predictDisaster = async (req, res, next) => {
    try {
        const { disaster_type, location } = req.body;

        const prediction = new DisasterPrediction({
            disaster_type,
            location,
            risk_level: "moderate",
            probability: 0.65,
            time_window: "next 7 days",
            severity_estimate: "moderate to high"
        });
        await prediction.save();

        res.json({
            ...prediction.toObject(),
            recommendations: [
                "Monitor weather conditions closely",
                "Prepare emergency supplies"
            ]
        });
    } catch (error) {
        next(error);
    }
};

export const getPollutionHeatmap = async (req, res, next) => {
    try {
        const { pollutant = "pm2.5" } = req.query;
        res.json({
            pollutant,
            unit: pollutant === "pm2.5" ? "µg/m³" : "ppm",
            locations: [
                { lat: 22.8046, lng: 86.2029, value: 95, status: "moderate" },
                { lat: 22.7867, lng: 86.1845, value: 120, status: "unhealthy" },
                { lat: 22.8156, lng: 86.2234, value: 75, status: "good" }
            ]
        });
    } catch (error) {
        next(error);
    }
};

export const getRenewableEnergy = async (req, res, next) => {
    try {
        res.json({
            current_generation: { solar: 450, wind: 320, total: 1780 },
            efficiency_percentage: 80.9,
            recommendations: ["Increase solar panel installation"]
        });
    } catch (error) {
        next(error);
    }
};

export const logWaste = async (req, res, next) => {
    try {
        const { waste_type, quantity, unit } = req.body;

        const recyclingRates = {
            plastic: 0.25, paper: 0.65, glass: 0.75,
            metal: 0.85, organic: 0.90, electronic: 0.45
        };

        const rate = recyclingRates[waste_type?.toLowerCase()] || 0.3;
        const recyclableAmount = quantity * rate;

        const log = new WasteLog({
            waste_type,
            quantity,
            unit,
            recyclable_amount: recyclableAmount
        });
        await log.save();

        res.json({
            ...log.toObject(),
            environmental_impact: {
                co2_saved_kg: recyclableAmount * 2.5,
                energy_saved_kwh: recyclableAmount * 5
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAwarenessContent = async (req, res, next) => {
    try {
        res.json({
            content: [
                { title: "Understanding Climate Change", category: "climate", content_type: "article" },
                { title: "Reducing Carbon Footprint", category: "lifestyle", content_type: "guide" }
            ]
        });
    } catch (error) {
        next(error);
    }
};

export const getEnvSettings = async (req, res, next) => {
    try {
        res.json({
            alert_threshold: { air_quality: 150, temperature: 35 },
            monitoring_enabled: true
        });
    } catch (error) {
        next(error);
    }
};
