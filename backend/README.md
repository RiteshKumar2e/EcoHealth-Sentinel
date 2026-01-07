# EcoHealth Sentinel - Backend API

Professional Node.js backend for the EcoHealth Sentinel platform, providing AI-powered services for Agriculture, Healthcare, and Environment monitoring.

## 🚀 Features

### Domain-Specific AI Chatbots
- **Agriculture Bot** 🌾 - Hindi responses for farming queries (crop diseases, irrigation, soil health)
- **Healthcare Bot** 🏥 - English medical assistance (symptoms, appointments, health monitoring)
- **Environment Bot** 🌍 - English eco-friendly guidance (air quality, climate, waste management)

### Core Services
- **Healthcare Management** - Appointments, vital signs monitoring, AI diagnosis
- **Agricultural Monitoring** - Crop disease detection, market forecasts, pest control
- **Environmental Tracking** - Carbon footprint calculation, air quality monitoring
- **Emergency Services** - SOS alerts, emergency metrics

### Security & Performance
- ✅ Rate limiting on all endpoints
- ✅ Input validation with express-validator
- ✅ CORS enabled
- ✅ Helmet security headers
- ✅ Request logging
- ✅ Error handling middleware

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start

# Initialize database
npm run init-db
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecohealth_sentinel
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

## 🗄️ Database Setup

### PostgreSQL Installation

**Windows:**
```bash
choco install postgresql
```

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database

```bash
psql -U postgres
CREATE DATABASE ecohealth_sentinel;
\q
```

See `POSTGRESQL_MIGRATION.md` for detailed setup instructions.

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Documentation
```
GET /api/docs - Complete API documentation
GET /api/health - Server health check
```

### Chatbot Service
```
POST /api/chatbot
Body: {
  "message": "your message",
  "domain": "agriculture|healthcare|environment",
  "sessionId": "optional-session-id"
}

GET /api/chatbot/history?sessionId=xxx&domain=xxx
```

**Rate Limit:** 20 messages per minute

### Healthcare
```
GET  /api/healthcare/dashboard
POST /api/healthcare/appointments
GET  /api/healthcare/appointments
POST /api/healthcare/remote-monitoring
POST /api/healthcare/diagnosis-assistant
```

### Agriculture
```
GET  /api/agriculture/dashboard
POST /api/agriculture/crop-disease-detection
GET  /api/agriculture/market/forecast
GET  /api/agriculture/pests
GET  /api/agriculture/treatments
POST /api/agriculture/treatments
GET  /api/agriculture/community/posts
POST /api/agriculture/community/posts
```

### Environment
```
GET  /api/environment/dashboard
POST /api/environment/carbon-calculation
Body: {
  "activity_type": "travel|electricity|food|waste",
  "value": 100
}
```

### Emergency
```
GET  /api/emergency/metrics
POST /api/emergency/sos
```

## 🤖 Chatbot Knowledge Base

### Agriculture (Hindi)
- Crop diseases (फसल रोग)
- Irrigation tips (सिंचाई)
- Soil health (मिट्टी स्वास्थ्य)
- Fertilizer guidance (उर्वरक)
- Weather updates (मौसम)
- Market prices (बाजार भाव)

### Healthcare (English)
- Symptom checking
- Appointment booking
- Emergency services
- Medication information
- Health monitoring
- Preventive care

### Environment (English)
- Air quality monitoring
- Climate predictions
- Waste management
- Renewable energy
- Wildlife conservation
- Carbon footprint

## 📊 Database Models

- **ChatMessage** - Chat history with domain tagging
- **User** - User authentication
- **Appointment** - Healthcare appointments
- **Patient** - Patient records
- **Doctor** - Doctor profiles
- **Treatment** - Agricultural treatments
- **Pest** - Pest information
- **Post** - Community posts
- **Report** - Generated reports
- **EmergencyMetrics** - Emergency statistics

## 🛡️ Security Features

### Rate Limiting
- General API: 100 requests per 15 minutes
- Chatbot: 20 messages per minute
- Authentication: 5 attempts per 15 minutes

### Input Validation
All endpoints validate:
- Required fields
- Data types
- String lengths
- Email formats
- Date formats

### Error Handling
- Centralized error middleware
- Detailed error messages in development
- Generic messages in production
- 404 handler for unknown routes

## 🔍 Monitoring

### Health Check Response
```json
{
  "success": true,
  "status": "healthy",
  "uptime": {
    "seconds": 3600,
    "formatted": "1h"
  },
  "database": {
    "status": "connected",
    "name": "ecohealth_sentinel"
  },
  "memory": {
    "rss": "50.25 MB",
    "heapUsed": "30.15 MB"
  }
}
```

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [...]
}
```

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error
- `503` - Service Unavailable

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test chatbot (Agriculture)
curl -X POST http://localhost:5000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "crop disease kaise pehchane?", "domain": "agriculture"}'

# Test chatbot (Healthcare)
curl -X POST http://localhost:5000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "I have a fever", "domain": "healthcare"}'

# Test chatbot (Environment)
curl -X POST http://localhost:5000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"message": "How to reduce carbon footprint?", "domain": "environment"}'
```

## 📚 Dependencies

### Core
- `express` - Web framework
- `sequelize` - SQL ORM (like SQLAlchemy)
- `pg` - PostgreSQL client
- `pg-hstore` - JSON serialization
- `ws` - WebSocket support

### Security
- `helmet` - Security headers
- `cors` - Cross-origin resource sharing
- `express-rate-limit` - Rate limiting
- `express-validator` - Input validation

### Utilities
- `dotenv` - Environment variables
- `compression` - Response compression
- `morgan` - Request logging

## 🔄 WebSocket Support

Real-time updates via WebSocket:
```javascript
const ws = new WebSocket('ws://localhost:5000');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Update:', data);
};
```

## 📞 Support

For issues or questions:
- Email: support@ecohealth-sentinel.com
- Documentation: http://localhost:5000/api/docs

## 📄 License

ISC

---

**Built with ❤️ for sustainable agriculture, quality healthcare, and environmental protection**
