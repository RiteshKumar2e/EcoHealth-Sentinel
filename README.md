# EcoHealth Sentinel 🌍🏥🌾

![Project Status](https://img.shields.io/badge/Status-Active_Development-emerald?style=for-the-badge)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-orange?style=for-the-badge)

> **Next-Generation Multi-Domain AI Command Center**  
> *Bridging Agriculture, Healthcare, and Environmental Intelligence through Advanced Telemetry and Generative AI.*

---

## 📖 Table of Contents
- [Executive Summary](#-executive-summary)
- [System Architecture](#-system-architecture)
- [Core Modules](#-core-modules)
    - [AgriAI (Smart Agriculture)](#-agriai-smart-agriculture)
    - [HealthGuard (Healthcare)](#-healthguard-healthcare)
    - [EcoSense (Environment)](#-ecosense-environment)
- [Technology Stack](#-technology-stack)
- [Key Features](#-key-features)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Roadmap](#-roadmap)

---

## 🚀 Executive Summary

**EcoHealth Sentinel** is a unified digital ecosystem designed to solve critical challenges in three interconnected domains: **Food Security**, **Public Health**, and **Environmental Stability**. 

By leveraging **Gemini AI**, **Socket.io** for real-time telemetry, and a **Command Center** user interface, the platform transforms raw sensor data into actionable, predictive intelligence. It provides farmers, doctors, and environmentalists with a "single pane of glass" to monitor vital statistics, predict anomalies, and automate crisis responses.

---

## 🏗 System Architecture

The project follows a modern **Monorepo-style** structure with a decoupled client-server architecture:

*   **Frontend**: A high-fidelity React 19 SPA (Single Page Application) optimized for performance and visual impact ("Glassmorphism" UI).
*   **Backend**: A robust Node.js/Express REST API that handles data ingestion, AI processing, and real-time WebSocket broadcasting.
*   **AI Engine**: Integration with Google's **Gemini Pro Vision** for multimodal analysis (images, text, sensor data).
*   **Database**: MongoDB for flexible, schema-less storage of varied telemetry data types.

---

## 📦 Core Modules

### 🌾 AgriAI (Smart Agriculture)
*   **Precision Telemetry**: Live monitoring of soil moisture, temperature, and humidity with < 100ms latency.
*   **AI Vision Diagnostics**: Upload crop leaf images to detect diseases (e.g., Blight, Rust) with 95%+ confidence using Computer Vision.
*   **Yield Forecasting**: Predictive models estimating harvest output based on historical weather and soil data.
*   **Supply Chain Logistics**: Track resource distribution and shipment status in real-time.

### 🏥 HealthGuard (Healthcare)
*   **Patient Vitals**: Remote monitoring of heart rate, SpO2, and blood pressure.
*   **Medical AI Assistant**: Automated triaging and symptom analysis to assist medical professionals.
*   **Emergency Alerts**: Automated SOS triggering when vitals breach critical thresholds.

### 🌍 EcoSense (Environment)
*   **AQI Monitoring**: Real-time tracking of PM2.5, CO2, and other pollutants.
*   **Disaster Early Warning**: AI-driven alerts for potential environmental hazards (e.g., floods, smog spikes).

---

## 💻 Technology Stack

### **Frontend Client**
| Technology | Usage |
| :--- | :--- |
| **React 19** | Core UI Framework |
| **Vite** | Next-Gen Build Tool (Blazing fast HMR) |
| **TailwindCSS** | Utility-first styling |
| **Framer Motion** | Production-ready animations |
| **Socket.io-client** | Real-time WebSocket communication |
| **Recharts / Leaflet** | Data Visualization & Mapping |
| **Lucide React** | Modern, lightweight iconography |

### **Backend Server**
| Technology | Usage |
| :--- | :--- |
| **Node.js & Express** | Scalable Server Runtime |
| **MongoDB & Mongoose** | NoSQL Database & ORM |
| **Google Gemini API** | Generative AI & Vision capabilities |
| **Socket.io** | Bi-directional event-based communication |
| **JWT & Bcrypt** | Secure Authentication & Encryption |
| **Twilio** | SMS/WhatsApp Integration for Alerts |

---

## ✨ Key Features

1.  **"Command Center" Aesthetic**: a Premium, dark-mode-first UI design featuring glassmorphism, neon accents, and a dashboard layout used in high-end control rooms.
2.  **Multimodal AI**: The system sees, reads, and interprets data. It doesn't just show charts; it explains *why* the data matters.
3.  **Real-Time Pulse**: Visual "Live" indicators and heartbeat animations synced with actual data stream frequency.
4.  **Global Accessibility**: Built-in Internationalization (i18n) support for multiple languages.
5.  **Role-Based Access**: Specialized dashboards for Farmers, Doctors, and Admins.

---

## 🏁 Getting Started

### Prerequisites
*   Node.js (v18.0.0 or higher)
*   MongoDB (Local or Atlas URL)
*   NPM or Yarn package manager

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/EcoHealth-Sentinel.git
    cd EcoHealth-Sentinel
    ```

2.  **Setup the Backend**
    ```bash
    cd backend
    npm install
    # Create .env file (see Configuration section)
    npm run dev
    ```

3.  **Setup the Frontend**
    ```bash
    # Open a new terminal
    cd frontend
    npm install
    # Create .env file (see Configuration section)
    npm run dev
    ```

4.  **Access the Platform**
    Open your browser and navigate to `http://localhost:5173`.

---

## ⚙️ Configuration

### **Backend (.env)**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecohealth
JWT_SECRET=your_super_secret_key_here
GEMINI_API_KEY=your_google_gemini_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
TWILIO_ACCOUNT_SID=optional_twilio_sid
TWILIO_AUTH_TOKEN=optional_twilio_token
```

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## 🗺️ Roadmap

- [x] Core Authentication & Role Management
- [x] Agriculture Telemetry & Vision
- [x] Real-time Dashboard Implementation
- [ ] Healthcare Wearable Integration (Fitbit/Garmin API)
- [ ] Mobile App (React Native)
- [ ] Offline Mode (PWA Support)

---

## 📝 License

This project is open-source and available under the **ISC License**.

---

*Built with ❤️ for a smarter, safer planet.*
