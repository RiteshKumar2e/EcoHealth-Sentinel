import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Appointment = sequelize.define('appointment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    patient_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [2, 100]
        }
    },
    patient_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    patient_phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    doctor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    appointment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    appointment_time: {
        type: DataTypes.TIME,
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: [0, 500]
        }
    },
    status: {
        type: DataTypes.ENUM('scheduled', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'scheduled'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    indexes: [
        {
            fields: ['doctor_id', 'appointment_date']
        },
        {
            fields: ['status']
        }
    ]
});

// Define association
Appointment.belongsTo(User, { as: 'doctor', foreignKey: 'doctor_id' });

export default Appointment;
