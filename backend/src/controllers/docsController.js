export const getApiDocs = (req, res) => {
    res.json({
        name: "EcoHealth Sentinel API",
        version: "2.0.0",
        description: "Comprehensive AI-powered platform for Agriculture, Healthcare, and Environment monitoring",
        baseUrl: "http://localhost:5000/api",
        endpoints: {
            chatbot: {
                description: "Domain-specific AI chatbot service",
                routes: [
                    {
                        method: "POST",
                        path: "/chatbot",
                        body: {
                            message: "string (required, 1-1000 chars)",
                            sessionId: "string (optional)",
                            domain: "string (optional: agriculture|healthcare|environment)"
                        },
                        rateLimit: "20 requests per minute",
                        response: {
                            success: "boolean",
                            response: "string",
                            domain: "string",
                            intent: "string"
                        }
                    },
                    {
                        method: "GET",
                        path: "/chatbot/history",
                        query: {
                            sessionId: "string (optional)",
                            domain: "string (optional)"
                        },
                        response: {
                            success: "boolean",
                            messages: "array"
                        }
                    }
                ]
            },
            healthcare: {
                description: "Healthcare management and monitoring",
                routes: [
                    {
                        method: "GET",
                        path: "/healthcare/dashboard",
                        response: "Dashboard statistics"
                    },
                    {
                        method: "POST",
                        path: "/healthcare/appointments",
                        body: {
                            patientName: "string (required, 2-100 chars)",
                            doctorId: "string (required)",
                            date: "ISO8601 date (required)",
                            time: "string (required)",
                            reason: "string (optional, max 500 chars)"
                        }
                    },
                    {
                        method: "GET",
                        path: "/healthcare/appointments",
                        response: "List of appointments"
                    },
                    {
                        method: "POST",
                        path: "/healthcare/remote-monitoring",
                        description: "Submit vital signs data"
                    },
                    {
                        method: "POST",
                        path: "/healthcare/diagnosis-assistant",
                        description: "AI-powered diagnosis assistance"
                    }
                ]
            },
            agriculture: {
                description: "Agricultural monitoring and management",
                routes: [
                    {
                        method: "GET",
                        path: "/agriculture/dashboard",
                        response: "Agricultural dashboard data"
                    },
                    {
                        method: "POST",
                        path: "/agriculture/crop-disease-detection",
                        body: {
                            cropType: "string (required)",
                            symptoms: "array (optional)"
                        }
                    },
                    {
                        method: "GET",
                        path: "/agriculture/market/forecast",
                        response: "Market price forecasts"
                    },
                    {
                        method: "GET",
                        path: "/agriculture/pests",
                        response: "Pest information"
                    },
                    {
                        method: "GET",
                        path: "/agriculture/treatments",
                        response: "Treatment schedules"
                    },
                    {
                        method: "POST",
                        path: "/agriculture/treatments",
                        description: "Schedule new treatment"
                    },
                    {
                        method: "GET",
                        path: "/agriculture/community/posts",
                        response: "Community posts"
                    }
                ]
            },
            environment: {
                description: "Environmental monitoring and carbon tracking",
                routes: [
                    {
                        method: "GET",
                        path: "/environment/dashboard",
                        response: "Environmental statistics"
                    },
                    {
                        method: "POST",
                        path: "/environment/carbon-calculation",
                        body: {
                            activity_type: "string (required: travel|electricity|food|waste)",
                            value: "number (required, positive)"
                        },
                        response: {
                            carbon_footprint: "number",
                            unit: "string",
                            recommendations: "array"
                        }
                    }
                ]
            },
            emergency: {
                description: "Emergency services and SOS alerts",
                routes: [
                    {
                        method: "GET",
                        path: "/emergency/metrics",
                        response: "Emergency metrics"
                    },
                    {
                        method: "POST",
                        path: "/emergency/sos",
                        description: "Send SOS alert"
                    }
                ]
            }
        },
        features: {
            domainSpecificChatbots: {
                agriculture: "Hindi responses for farming queries",
                healthcare: "English medical assistance",
                environment: "English eco-friendly guidance"
            },
            security: {
                rateLimiting: "Enabled on all endpoints",
                inputValidation: "Express-validator middleware",
                cors: "Enabled for cross-origin requests",
                helmet: "Security headers enabled"
            },
            database: "MongoDB with Mongoose ODM"
        },
        contact: {
            support: "support@ecohealth-sentinel.com",
            documentation: "https://docs.ecohealth-sentinel.com"
        }
    });
};
