import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ChatMessage = sequelize.define('chat_message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 1000]
        }
    },
    sender: {
        type: DataTypes.ENUM('user', 'bot'),
        allowNull: false,
        defaultValue: 'user'
    },
    session_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
        index: true
    },
    domain: {
        type: DataTypes.ENUM('agriculture', 'healthcare', 'environment', 'general'),
        allowNull: false,
        defaultValue: 'general',
        index: true
    },
    intent: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {}
    }
}, {
    indexes: [
        {
            fields: ['session_id', 'domain']
        },
        {
            fields: ['created_at']
        }
    ]
});

export default ChatMessage;
