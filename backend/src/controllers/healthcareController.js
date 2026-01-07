import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import VitalSigns from '../models/VitalSigns.js';
import PatientAlert from '../models/PatientAlert.js';
import { generateAIResponse, generateJSONResponse } from '../services/aiService.js';

export const getHealthcareDashboard = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAppointments = await Appointment.countDocuments({
            appointment_date: { $gte: today, $lt: tomorrow }
        });

        const totalPatients = await Patient.countDocuments({});
        const criticalAlerts = await PatientAlert.countDocuments({ severity: 'critical', status: 'active' });

        res.json({
            success: true,
            stats: {
                today_appointments: todayAppointments,
                total_patients: totalPatients,
                critical_alerts: criticalAlerts,
                available_doctors: 25
            }
        });
    } catch (error) {
        next(error);
    }
};

export const scheduleAppointment = async (req, res, next) => {
    try {
        const appointment = new Appointment(req.body);
        await appointment.save();
        res.json({ success: true, message: 'Appointment scheduled successfully', appointment });
    } catch (error) {
        next(error);
    }
};

export const getAppointments = async (req, res, next) => {
    try {
        const { patient_id, doctor_id, status } = req.query;
        let query = {};
        if (patient_id) query.patient_id = patient_id;
        if (doctor_id) query.doctor_id = doctor_id;
        if (status) query.status = status;

        const appointments = await Appointment.find(query).sort({ appointment_date: 1 });
        res.json({ success: true, appointments });
    } catch (error) {
        next(error);
    }
};

export const submitVitalSigns = async (req, res, next) => {
    try {
        const vitals = new VitalSigns(req.body);
        await vitals.save();

        let alerts = [];
        if (vitals.heart_rate < 60 || vitals.heart_rate > 100) alerts.push("Heart rate outside normal range");
        if (vitals.temperature > 38.0) alerts.push("Elevated temperature detected");
        if (vitals.oxygen_saturation < 95) alerts.push("Low oxygen saturation");

        if (alerts.length > 0) {
            const alert = new PatientAlert({
                patient_id: vitals.patient_id,
                alert_type: 'vital_signs',
                severity: alerts.length > 1 ? 'high' : 'medium',
                message: alerts.join(', '),
                status: 'active'
            });
            await alert.save();
        }

        res.json({ success: true, status: 'recorded', alerts });
    } catch (error) {
        next(error);
    }
};

export const aiDiagnosisAssistant = async (req, res, next) => {
    try {
        const { symptoms, severity } = req.body;

        const prompt = `You are a medical AI assistant. Analyze these symptoms: ${symptoms.join(', ')}. 
        Severity level provided: ${severity}.
        Return a JSON object with:
        "possible_conditions": array of objects { "condition": string, "confidence": number(0-1), "description": string, "recommendations": string[] },
        "urgency": string ("Low", "Medium", "High"),
        "disclaimer": string
        Ensure the disclaimer notes you are an AI, not a doctor.`;

        const response = await generateJSONResponse(prompt);
        res.json({
            success: true,
            ...response
        });
    } catch (error) {
        console.error('AI Diagnosis Error:', error);
        res.status(500).json({ success: false, error: 'AI Assistant currently unavailable' });
    }
};

export const getAnalyses = async (req, res, next) => {
    try {
        res.json({
            success: true,
            recentAnalyses: [
                { id: 101, type: "Chest X-Ray", date: new Date().toISOString().split('T')[0], findings: "Normal cardiac silhouette, clear lung fields.", confidence: 98, priority: "normal" },
                { id: 102, type: "Brain MRI", date: new Date().toISOString().split('T')[0], findings: "No acute intracranial pathology detected.", confidence: 95, priority: "normal" }
            ]
        });
    } catch (error) {
        next(error);
    }
};

export const getStats = async (req, res, next) => {
    try {
        res.json({
            success: true,
            stats: [
                { label: "My Scans Analyzed", value: "24", icon: 'ImageIcon', color: "#2563eb" },
                { label: "AI Precision", value: "96.5%", icon: 'Brain', color: "#16a34a" },
                { label: "Avg Analysis Time", value: "32 sec", icon: 'Clock', color: "#7c3aed" },
                { label: "Detected Alerts", value: "0", icon: 'AlertCircle', color: "#ef4444" }
            ]
        });
    } catch (error) {
        next(error);
    }
};

export const uploadScan = async (req, res, next) => {
    try {
        const prompt = `Generate a realistic AI analysis report for a generic medical scan (e.g., X-Ray or MRI). 
        Return JSON: { "findings": string, "confidence": number(80-99) }`;
        const analysis = await generateJSONResponse(prompt);

        res.json({
            success: true,
            analysis
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Scan analysis failed' });
    }
};

export const chatWithAssistant = async (req, res, next) => {
    try {
        const { message } = req.body;
        const prompt = `You are a helpful health assistant. A user says: "${message}". 
        Provide a professional, empathetic response in 2-3 sentences.`;
        const reply = await generateAIResponse(prompt);

        res.json({
            success: true,
            reply
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Assistant unavailable' });
    }
};
