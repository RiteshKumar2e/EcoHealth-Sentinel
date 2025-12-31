import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
import VitalSigns from '../models/VitalSigns.js';
import PatientAlert from '../models/PatientAlert.js';

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

        // Simulate AI diagnosis
        let possible_conditions = [];
        const symps = symptoms.map(s => s.toLowerCase());

        if (symps.includes('fever')) {
            possible_conditions.push({
                condition: "Viral Infection",
                confidence: 0.75,
                description: "Common viral infection causing fever",
                recommendations: ["Rest", "Stay hydrated"]
            });
        }

        if (symps.includes('cough')) {
            possible_conditions.push({
                condition: "Upper Respiratory Infection",
                confidence: 0.68,
                description: "Infection of upper respiratory tract",
                recommendations: ["Warm fluids", "Steam inhalation"]
            });
        }

        if (possible_conditions.length === 0) {
            possible_conditions.push({
                condition: "General Assessment Needed",
                confidence: 0.50,
                description: "Requires professional evaluation",
                recommendations: ["Consult a doctor"]
            });
        }

        res.json({
            success: true,
            possible_conditions,
            urgency: severity === 'high' ? 'High' : 'Medium',
            disclaimer: "AI-assisted suggestion only."
        });
    } catch (error) {
        next(error);
    }
};
