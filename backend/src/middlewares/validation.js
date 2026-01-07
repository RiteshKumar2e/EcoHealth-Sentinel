import { body, validationResult } from 'express-validator';

// Validation middleware to check for errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

// Chatbot message validation
export const validateChatMessage = [
    body('message')
        .trim()
        .notEmpty().withMessage('Message cannot be empty')
        .isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
    body('domain')
        .optional()
        .isIn(['agriculture', 'healthcare', 'environment', 'general']).withMessage('Invalid domain'),
    body('sessionId')
        .optional()
        .isString().withMessage('Session ID must be a string'),
    validate
];

// Appointment validation
export const validateAppointment = [
    body('patientName')
        .trim()
        .notEmpty().withMessage('Patient name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('doctorId')
        .notEmpty().withMessage('Doctor ID is required'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Invalid date format'),
    body('time')
        .notEmpty().withMessage('Time is required'),
    body('reason')
        .optional()
        .isLength({ max: 500 }).withMessage('Reason must not exceed 500 characters'),
    validate
];

// Carbon calculation validation
export const validateCarbonCalculation = [
    body('activity_type')
        .notEmpty().withMessage('Activity type is required')
        .isIn(['travel', 'electricity', 'food', 'waste']).withMessage('Invalid activity type'),
    body('value')
        .notEmpty().withMessage('Value is required')
        .isNumeric().withMessage('Value must be a number')
        .isFloat({ min: 0 }).withMessage('Value must be positive'),
    validate
];

// Crop disease detection validation
export const validateCropDisease = [
    body('cropType')
        .trim()
        .notEmpty().withMessage('Crop type is required'),
    body('symptoms')
        .optional()
        .isArray().withMessage('Symptoms must be an array'),
    validate
];

// User registration validation
export const validateUserRegistration = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    validate
];

// User login validation
export const validateUserLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    validate
];
