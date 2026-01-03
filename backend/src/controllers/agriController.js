import Pest from '../models/Pest.js';
import Treatment from '../models/Treatment.js';
import Report from '../models/Report.js';
import Config from '../models/Config.js';
import Post from '../models/Post.js';

export const getAgriDashboard = async (req, res, next) => {
    try {
        res.json({
            success: true,
            stats: {
                total_farms: 5,
                total_crops: 12,
                recent_detections: 3,
                active_schedules: 15
            },
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
            { name: "Healthy", confidence: 0.95, severity: "None", recommendations: ["Continue maintenance"] }
        ];
        res.json(diseases[Math.floor(Math.random() * diseases.length)]);
    } catch (error) {
        next(error);
    }
};

export const getMarketForecast = async (req, res, next) => {
    try {
        // Base realistic data for January 2026
        // Base realistic data for January 2026 - Extended to 30 Crops
        const baseData = {
            // -- Staples --
            tomato: { current: 42, trend: 'up', change: '+12.4%', demand: 'High', factors: [{ factor: 'Mandi Supply', impact: 'High', description: 'Reduced arrivals in Azadpur Mandi' }, { factor: 'Transport Strike', impact: 'Medium', description: 'Logistics delay affecting shelf life' }, { factor: 'Weather', impact: 'Low', description: 'Clear skies in Nashik' }], recommendation: 'Sell 60% of stock by Tuesday (Day 4)' },
            wheat: { current: 31.5, trend: 'up', change: '+4.2%', demand: 'Stable', factors: [{ factor: 'Global Futures', impact: 'High', description: 'CBOT prices rising due to export curbs' }, { factor: 'MSP Rumors', impact: 'Medium', description: 'Anticipated hike in supportive pricing' }, { factor: 'Warehouse Load', impact: 'Low', description: 'Consistent outflow to mills' }], recommendation: 'Hold for minimum 10 days for peak margins' },
            rice: { current: 54, trend: 'up', change: '+2.1%', demand: 'Very High', factors: [{ factor: 'Export Demand', impact: 'High', description: 'Basmati orders up from SE Asia' }, { factor: 'Fuel Surcharge', impact: 'Medium', description: 'Freight costs increasing by 5%' }, { factor: 'New Crop', impact: 'Low', description: 'Early arrivals expected next week' }], recommendation: 'Sell immediate harvest, hedge for Basmati' },
            onion: { current: 58, trend: 'down', change: '-8.5%', demand: 'Medium', factors: [{ factor: 'Buffer Stock', impact: 'High', description: 'Government releasing extra 2MT' }, { factor: 'Import Flow', impact: 'Medium', description: 'Egyptian onions hitting Mumbai port' }, { factor: 'Local Harvest', impact: 'Medium', description: 'Bumper crop from Maharashtra' }], recommendation: 'Sell immediately before price floor breach' },
            potato: { current: 28.5, trend: 'up', change: '+15.2%', demand: 'High', factors: [{ factor: 'Cold Storage', impact: 'High', description: 'Capacity hitting 95% limit' }, { factor: 'Processing', impact: 'Medium', description: 'High demand from chip manufacturers' }, { factor: 'Seeds', impact: 'Low', description: 'Quality seeds availability stable' }], recommendation: 'Aggressive hold pattern until Day 5' },
            corn: { current: 24.5, trend: 'up', change: '+5.8%', demand: 'High', factors: [{ factor: 'Poultry Feed', impact: 'High', description: 'Increased demand from poultry sector' }, { factor: 'Ethanol Blending', impact: 'Medium', description: 'Govt push for higher ethanol blending' }, { factor: 'Global Supply', impact: 'Low', description: 'Stable global supply' }], recommendation: 'Hold for short term gains' },

            // -- Cash Crops --
            cotton: { current: 6200, trend: 'down', change: '-1.5%', demand: 'Low', factors: [{ factor: 'Textile Demand', impact: 'High', description: 'Sluggish demand from textile mills' }, { factor: 'Global Prices', impact: 'Medium', description: 'Weak international prices' }, { factor: 'Pest Attack', impact: 'Low', description: 'Minor pink bollworm reports' }], recommendation: 'Sell on rallies' },
            soybean: { current: 4800, trend: 'up', change: '+3.2%', demand: 'Medium', factors: [{ factor: 'Edible Oil', impact: 'High', description: 'Rising edible oil prices supporting soybean' }, { factor: 'Meal Export', impact: 'Medium', description: 'Good demand for soymeal exports' }, { factor: 'Weather', impact: 'Low', description: 'Dry spell aiding harvest' }], recommendation: 'Hold for better realization' },
            sugarcane: { current: 340, trend: 'stable', change: '0.0%', demand: 'Stable', factors: [{ factor: 'FRP Increase', impact: 'High', description: 'Govt announces hike in FRP' }, { factor: 'Ethanol Push', impact: 'Medium', description: 'Diversion to ethanol increasing' }, { factor: 'Recovery Rate', impact: 'Low', description: 'Good sugar recovery rate' }], recommendation: 'Consistent supply to mills' },
            rubber: { current: 180, trend: 'up', change: '+1.8%', demand: 'High', factors: [{ factor: 'Tyre Industry', impact: 'High', description: 'Demand recovery in auto sector' }, { factor: 'International Rates', impact: 'Medium', description: 'Bangkok rubber prices firm' }, { factor: 'Weather', impact: 'Low', description: 'Rains impacting tapping' }], recommendation: 'Hold for price strength' },

            // -- Pulses --
            chickpea: { current: 5100, trend: 'stable', change: '0.5%', demand: 'Stable', factors: [{ factor: 'Festive Demand', impact: 'High', description: 'Steady demand ahead of festivals' }, { factor: 'Sowing Area', impact: 'Medium', description: 'Higher sowing area reported' }, { factor: 'Stock Limits', impact: 'Low', description: 'Govt monitoring stock limits' }], recommendation: 'Sell systematically' },
            moong: { current: 7200, trend: 'up', change: '+2.5%', demand: 'High', factors: [{ factor: 'Crop Damage', impact: 'High', description: 'Unseasonal rains damaged crop' }, { factor: 'Imports', impact: 'Medium', description: 'Restricted import quota' }, { factor: 'Retail', impact: 'Low', description: 'Steady retail consumption' }], recommendation: 'Hold, prices likely to rise' },
            tur: { current: 8500, trend: 'up', change: '+4.1%', demand: 'Very High', factors: [{ factor: 'Shortage', impact: 'High', description: 'Supply deficit estimated at 10%' }, { factor: 'African Imports', impact: 'Medium', description: 'Delayed shipments from Africa' }, { factor: 'Stockpiling', impact: 'Low', description: 'Millers building inventory' }], recommendation: 'Strong hold recommended' },
            urad: { current: 7800, trend: 'stable', change: '-0.2%', demand: 'Medium', factors: [{ factor: 'Myanmar Imports', impact: 'High', description: 'Smooth flow from Myanmar' }, { factor: 'Summer Sowing', impact: 'Medium', description: 'Good summer crop prospects' }, { factor: 'Quality', impact: 'Low', description: 'Average quality arrivals' }], recommendation: 'Range bound movement' },
            lentil: { current: 6100, trend: 'down', change: '-1.2%', demand: 'Low', factors: [{ factor: 'Canadian Supply', impact: 'High', description: 'Cheaper Canadian lentils arriving' }, { factor: 'Rabi Outcome', impact: 'Medium', description: 'Record rabi production' }, { factor: 'Stocks', impact: 'Low', description: 'Ample carryover stocks' }], recommendation: 'Sell on bounce' },

            // -- Spices --
            mustard: { current: 5450, trend: 'up', change: '+2.8%', demand: 'High', factors: [{ factor: 'Winter Demand', impact: 'High', description: 'High demand for mustard oil in winter' }, { factor: 'Supply Gap', impact: 'Medium', description: 'Lower carryover stocks' }, { factor: 'Prices', impact: 'Low', description: 'Firm prices in spot market' }], recommendation: 'Hold for peak winter demand' },
            turmeric: { current: 14200, trend: 'up', change: '+5.5%', demand: 'Very High', factors: [{ factor: 'Crop Estimation', impact: 'High', description: 'Lower crop estimate for next season' }, { factor: 'Export', impact: 'Medium', description: 'Strong export enquiries' }, { factor: 'Nizamabad', impact: 'Low', description: 'Active trading in Nizamabad' }], recommendation: 'Buy on dips, strong bull run' },
            jeera: { current: 28500, trend: 'down', change: '-2.1%', demand: 'Low', factors: [{ factor: 'Sowing Data', impact: 'High', description: 'Record increase in sowing area' }, { factor: 'China Demand', impact: 'Medium', description: 'Reduced buying from China' }, { factor: 'Carryover', impact: 'Low', description: 'Pipeline empty' }], recommendation: 'Book profits on rallies' },
            coriander: { current: 7400, trend: 'stable', change: '0.8%', demand: 'Medium', factors: [{ factor: 'Ramganj Mandi', impact: 'High', description: 'Steady arrivals in Ramganj' }, { factor: 'Masala Co', impact: 'Medium', description: 'Range bound buying by masala companies' }, { factor: 'Weather', impact: 'Low', description: 'Favorable for standing crop' }], recommendation: 'Accumulate for long term' },
            chilli: { current: 18500, trend: 'up', change: '+3.2%', demand: 'High', factors: [{ factor: 'Export Demand', impact: 'High', description: 'China buying Teja variety Aggressively' }, { factor: 'Virus Attack', impact: 'Medium', description: 'Yield loss due to virus in AP' }, { factor: 'Cold Storage', impact: 'Low', description: 'Stock loading started' }], recommendation: 'Hold premium varieties' },

            // -- Fruits --
            banana: { current: 18, trend: 'stable', change: '0.0%', demand: 'High', factors: [{ factor: 'Festive Season', impact: 'High', description: 'Marriage season demand' }, { factor: 'Transport', impact: 'Medium', description: 'High fuel affecting freight' }, { factor: 'Production', impact: 'Low', description: 'Steady production in Jalgaon' }], recommendation: 'Sell daily harvest' },
            mango: { current: 85, trend: 'up', change: '+15.0%', demand: 'Very High', factors: [{ factor: 'Season Start', impact: 'High', description: 'Early season arrivals commanding premium' }, { factor: 'Unseasonal Rain', impact: 'Medium', description: 'Flower droppage in Konkan' }, { factor: 'Export', impact: 'Low', description: 'Processing units opening' }], recommendation: 'Sell primarily A-Grade' },
            apple: { current: 120, trend: 'down', change: '-4.5%', demand: 'Medium', factors: [{ factor: 'CA Storage', impact: 'High', description: 'CA chambers opening stocks' }, { factor: 'Kinnaur Crop', impact: 'Medium', description: 'Late variety ending' }, { factor: 'Imports', impact: 'Low', description: 'Washington apples in market' }], recommendation: 'Clear stock before CA release' },
            orange: { current: 45, trend: 'down', change: '-3.2%', demand: 'Medium', factors: [{ factor: 'Nagpur Arrivals', impact: 'High', description: 'Peak arrivals from Nagpur' }, { factor: 'Transport', impact: 'Medium', description: 'Rake availability issues' }, { factor: 'Maturity', impact: 'Low', description: 'Good sugar content' }], recommendation: 'Sell, pressure on prices' },
            grapes: { current: 65, trend: 'up', change: '+8.2%', demand: 'High', factors: [{ factor: 'Nashik Export', impact: 'High', description: 'Container shortage easing' }, { factor: 'Quality', impact: 'Medium', description: 'Export quality rejection low' }, { factor: 'Domestic', impact: 'Low', description: 'Strong local demand' }], recommendation: 'Focus on export quality' },

            // -- Vegetables --
            cauliflower: { current: 22, trend: 'down', change: '-10.5%', demand: 'Low', factors: [{ factor: 'Local Harvest', impact: 'High', description: 'Glut in local mandis' }, { factor: 'Temperature', impact: 'Medium', description: 'Rapid maturity due to heat' }, { factor: 'Quality', impact: 'Low', description: 'Flower size reducing' }], recommendation: 'Sell immediately' },
            cabbage: { current: 15, trend: 'stable', change: '-1.2%', demand: 'Medium', factors: [{ factor: 'Supply', impact: 'High', description: 'Consistent supply' }, { factor: 'Fast Food', impact: 'Medium', description: 'Steady demand from street food' }, { factor: 'Shelf Life', impact: 'Low', description: 'Good cold tolerance' }], recommendation: 'Rotational harvesting' },
            brinjal: { current: 35, trend: 'up', change: '+5.4%', demand: 'High', factors: [{ factor: 'Wedding Season', impact: 'High', description: 'Bulk buying for catering' }, { factor: 'Pest', impact: 'Medium', description: 'Fruit borer incidence' }, { factor: 'Arrivals', impact: 'Low', description: 'Low arrivals in Vashi' }], recommendation: 'Hold for weekend' },
            garlic: { current: 180, trend: 'up', change: '+22.4%', demand: 'Very High', factors: [{ factor: 'Seed Demand', impact: 'High', description: 'High demand for sowing' }, { factor: 'Carryover', impact: 'Medium', description: 'Almost nil old stock' }, { factor: 'New Crop', impact: 'Low', description: 'Delayed by 15 days' }], recommendation: 'Strong buy/hold' },
            ginger: { current: 110, trend: 'up', change: '+4.5%', demand: 'High', factors: [{ factor: 'Bangalore Demand', impact: 'High', description: 'Strong buying from South' }, { factor: 'Harvesting', impact: 'Medium', description: 'Labor shortage for digging' }, { factor: 'Quality', impact: 'Low', description: 'Mature rhizome availability' }], recommendation: 'Sell partial stock' }
        };

        const days = ['Today', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        const responseData = {};

        // Apply real-time drift
        Object.keys(baseData).forEach(crop => {
            const data = baseData[crop];
            // Simulate live price fluctuation: +/- 2%
            const fluctuation = (Math.random() - 0.5) * 0.04;
            const liveCurrent = data.current * (1 + fluctuation);

            const forecast = days.map((day, index) => {
                // Generate forecast based on trend
                let factor = 1;
                if (data.trend === 'up') factor = 1 + (index * 0.015);
                else if (data.trend === 'down') factor = 1 - (index * 0.015);
                else factor = 1 + ((Math.random() - 0.5) * 0.01);

                // Add some randomness to forecast
                const randomVar = (Math.random() - 0.5) * 0.03;
                const predicted = liveCurrent * (factor + randomVar);

                // Confidence decreases with time
                const confidence = Math.max(0, Math.round(95 - (index * 4) + (Math.random() * 5)));

                return {
                    day,
                    price: parseFloat(predicted.toFixed(2)),
                    confidence
                };
            });
            // Ensure first day matches current "live" price exactly
            forecast[0].price = parseFloat(liveCurrent.toFixed(2));

            responseData[crop] = {
                ...data,
                current: parseFloat(liveCurrent.toFixed(2)),
                forecast,
                lastUpdated: new Date().toISOString()
            };
        });

        res.json(responseData);
    } catch (error) {
        next(error);
    }
};


// In-memory storage for shipments (simulated database)
let activeShipments = [
    {
        id: 'SH001',
        product: 'Tomatoes',
        quantity: '500 kg',
        from: 'Farm - Darbhanga',
        to: 'Mandi - Patna',
        status: 'in-transit',
        startTime: Date.now() - 30000, // Started 30s ago
        duration: 60000, // 1 min trip
        fromCoords: { lat: 26.1542, lng: 85.8918 }, // Darbhanga
        toCoords: { lat: 25.5941, lng: 85.1376 }, // Patna
        driver: { name: 'Ramesh Kumar', phone: '+91-9876543210', vehicle: 'Tata 407 (BR-01-GA-1234)' },
        temperature: '8.2°C',
        humidity: '65%'
    }
];

export const getSupplyChainData = async (req, res, next) => {
    try {
        const currentTime = Date.now();

        // Update positions for all active shipments
        const updatedShipments = activeShipments.map(shipment => {
            if (shipment.status !== 'in-transit') return shipment;

            const elapsedTime = currentTime - shipment.startTime;
            let progress = elapsedTime / shipment.duration;

            if (progress >= 1) {
                progress = 1;
                shipment.status = 'delivered';
                shipment.currentLocation = shipment.to;
            }

            // Calculate current coordinates based on progress
            const currentLat = shipment.fromCoords.lat + (shipment.toCoords.lat - shipment.fromCoords.lat) * progress;
            const currentLng = shipment.fromCoords.lng + (shipment.toCoords.lng - shipment.fromCoords.lng) * progress;

            // Estimate Arrival
            const remainingTime = Math.max(0, shipment.duration - elapsedTime);
            const remainingMins = Math.ceil(remainingTime / 60000 * 60); // scaled mins

            return {
                ...shipment,
                progress: Math.round(progress * 100),
                coordinates: { lat: currentLat, lng: currentLng },
                estimatedArrival: progress >= 1 ? 'Arrived' : `${remainingMins} mins`,
                temperature: (parseFloat(shipment.temperature) + (Math.random() - 0.5) * 0.1).toFixed(1) + '°C'
            };
        });

        // Sync back to storage (in a real DB this would be an update)
        activeShipments = updatedShipments;

        res.json({
            success: true,
            active_vehicles: activeShipments.filter(s => s.status === 'in-transit').length,
            completed_today: activeShipments.filter(s => s.status === 'delivered').length,
            shipments: activeShipments
        });
    } catch (error) {
        next(error);
    }
};

export const createShipment = async (req, res, next) => {
    try {
        const { product, quantity, from, to, driver, fromCoords, toCoords } = req.body;

        const newShipment = {
            id: `SH${Math.floor(1000 + Math.random() * 9000)}`,
            product,
            quantity,
            from,
            to,
            status: 'in-transit',
            startTime: Date.now(),
            duration: 120000, // Default 2 mins for demo
            fromCoords: fromCoords || { lat: 26.1542, lng: 85.8918 }, // Default to Darbhanga if missing
            toCoords: toCoords || { lat: 25.5941, lng: 85.1376 }, // Default to Patna if missing
            driver,
            temperature: '24.0°C', // Initial ambient
            humidity: '50%',
            progress: 0,
            coordinates: fromCoords || { lat: 26.1542, lng: 85.8918 }
        };

        activeShipments.push(newShipment);

        res.status(201).json({
            success: true,
            message: 'Shipment created successfully',
            shipment: newShipment
        });
    } catch (error) {
        next(error);
    }
};

// --- Pest Control & Treatment Management ---

export const getPests = async (req, res, next) => {
    try {
        let pests = await Pest.find();
        // Seed defaults if specific ones don't exist
        const defaultPests = [
            {
                name: 'Aphids',
                severity: 'Medium',
                crops: ['Tomato', 'Cotton', 'Wheat'],
                symptoms: 'Curled leaves, sticky residue, stunted growth',
                organicControl: ['Neem oil spray (5ml per liter)', 'Ladybugs'],
                chemicalControl: 'Imidacloprid 17.8% SL',
                prevention: 'Regular monitoring',
                aiDetection: 92,
                image: '🐛'
            },
            {
                name: 'Bollworm',
                severity: 'High',
                crops: ['Cotton', 'Tomato', 'Okra'],
                symptoms: 'Holes in fruits/bolls, larvae inside',
                organicControl: ['Bt spray', 'Pheromone traps'],
                chemicalControl: 'Chlorantraniliprole 18.5% SC',
                prevention: 'Crop rotation',
                aiDetection: 89,
                image: '🐛'
            },
            {
                name: 'Whitefly',
                severity: 'High',
                crops: ['Cotton', 'Tomato', 'Chili'],
                symptoms: 'Yellow leaves, sooty mold',
                organicControl: ['Yellow sticky traps', 'Neem oil'],
                chemicalControl: 'Thiamethoxam 25% WG',
                prevention: 'Resistant varieties',
                aiDetection: 94,
                image: '🦟'
            },
            {
                name: 'Fall Armyworm',
                severity: 'High',
                crops: ['Maize', 'Sorghum', 'Rice'],
                symptoms: 'Ragged holes in leaves, sawdust-like frass',
                organicControl: ['Neem oil', 'Beauveria bassiana'],
                chemicalControl: 'Spinetoram 11.7% SC',
                prevention: 'Deep ploughing, trap crops',
                aiDetection: 96,
                image: '🦋'
            },
            {
                name: 'Locust',
                severity: 'High',
                crops: ['All Crops'],
                symptoms: 'Complete defoliation, visible swarms',
                organicControl: ['Metarhizium acridum', 'Garlic spray'],
                chemicalControl: 'Lambda-cyhalothrin 5% EC',
                prevention: 'Monitor breeding grounds',
                aiDetection: 98,
                image: '🦗'
            },
            {
                name: 'Thrips',
                severity: 'Medium',
                crops: ['Chili', 'Onion', 'Capsicum'],
                symptoms: 'Leaf curling upward, silver streak marks',
                organicControl: ['Blue sticky traps', 'Neem oil'],
                chemicalControl: 'Fipronil 5% SC',
                prevention: 'Avoid excessive nitrogen',
                aiDetection: 91,
                image: '🐜'
            },
            {
                name: 'Red Spider Mite',
                severity: 'Medium',
                crops: ['Tea', 'Okra', 'Brinjal'],
                symptoms: 'Yellow speckled leaves, fine webbing',
                organicControl: ['Sulfur dust', 'Predatory mites'],
                chemicalControl: 'Spiromesifen 22.9% SC',
                prevention: 'Maintain humidity, remove weeds',
                aiDetection: 88,
                image: '🕷️'
            },
            {
                name: 'Rice Leaf Folder',
                severity: 'Medium',
                crops: ['Rice'],
                symptoms: 'Longitudinal white streaks, folded leaves',
                organicControl: ['Trichogramma chilonis', 'Light traps'],
                chemicalControl: 'Cartap Hydrochloride 50% SP',
                prevention: 'Avoid shade, balanced fertilizer',
                aiDetection: 93,
                image: '🐛'
            },
            {
                name: 'Mealybug',
                severity: 'Medium',
                crops: ['Cotton', 'Grapes', 'Hibiscus'],
                symptoms: 'Cottony masses on stems/leaves, sticky honeydew',
                organicControl: ['Cryptolaemus beetle', 'Soap solution'],
                chemicalControl: 'Profenofos 50% EC',
                prevention: 'Ant control (they farm mealybugs)',
                aiDetection: 95,
                image: '🐞'
            },
            {
                name: 'Fruit Fly',
                severity: 'High',
                crops: ['Mango', 'Guava', 'Gourd'],
                symptoms: 'Small holes on fruits, rotting, premature dropping',
                organicControl: ['Methyl Eugenol traps', 'Bagging fruits'],
                chemicalControl: 'Malathion 50% EC',
                prevention: 'Deep ploughing of orchard soil',
                aiDetection: 91,
                image: '🪰'
            },
            {
                name: 'Brown Plant Hopper',
                severity: 'High',
                crops: ['Rice'],
                symptoms: 'Hopper burn (drying of plants in patches)',
                organicControl: ['Neem oil', 'Alternate wetting and drying'],
                chemicalControl: 'Pymetrozine 50% WG',
                prevention: 'Wider plant spacing',
                aiDetection: 94,
                image: '🦟'
            },
            {
                name: 'Diamondback Moth',
                severity: 'High',
                crops: ['Cabbage', 'Cauliflower', 'Broccoli'],
                symptoms: 'Window-pane like holes in leaves',
                organicControl: ['Mustard trap cropping', 'Bt spray'],
                chemicalControl: 'Spinosad 45% SC',
                prevention: 'Clean cultivation',
                aiDetection: 92,
                image: '🦋'
            },
            {
                name: 'Jassids',
                severity: 'Medium',
                crops: ['Okra', 'Cotton', 'Eggplant'],
                symptoms: 'Hopper burn, yellowing of leaf margins',
                organicControl: ['Yellow sticky traps', 'Neem cake'],
                chemicalControl: 'Acetamiprid 20% SP',
                prevention: 'Intercropping with maize',
                aiDetection: 87,
                image: '🦗'
            },
            {
                name: 'Stem Borer',
                severity: 'High',
                crops: ['Rice', 'Sugarcane', 'Maize'],
                symptoms: 'Dead hearts, white heads (in rice)',
                organicControl: ['Pheromone traps', 'Trichogramma cards'],
                chemicalControl: 'Cartap Hydrochloride 4G',
                prevention: 'Stubbles burning after harvest',
                aiDetection: 90,
                image: '🐛'
            }
        ];

        // Upsert logic: Check if DB is empty or just seed missing ones
        if (pests.length < defaultPests.length) {
            for (const pest of defaultPests) {
                const exists = await Pest.findOne({ name: pest.name });
                if (!exists) {
                    await Pest.create(pest);
                }
            }
            // Re-fetch after seeding
            pests = await Pest.find();
        }
        res.json(pests);
    } catch (error) {
        next(error);
    }
};

export const getTreatments = async (req, res, next) => {
    try {
        const treatments = await Treatment.find().sort({ date: 1 });
        res.json(treatments);
    } catch (error) {
        next(error);
    }
};

export const scheduleTreatment = async (req, res, next) => {
    try {
        const treatment = new Treatment(req.body);
        await treatment.save();
        res.status(201).json(treatment);
    } catch (error) {
        next(error);
    }
};

export const updateTreatmentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const treatment = await Treatment.findByIdAndUpdate(id, { status }, { new: true });
        res.json(treatment);
    } catch (error) {
        next(error);
    }
};

export const deleteTreatment = async (req, res, next) => {
    try {
        await Treatment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Treatment deleted' });
    } catch (error) {
        next(error);
    }
};

// --- Report Management ---

export const getReports = async (req, res, next) => {
    try {
        let reports = await Report.find().sort({ createdAt: -1 });

        // Check if we've already seeded the initial data
        const isSeeded = await Config.findOne({ key: 'reports_seeded' });

        if (!isSeeded) {
            const initialReports = [
                {
                    name: 'Crop Yield Analysis - Winter 2025',
                    type: 'Yield Analysis',
                    date: 'Dec 28, 2025',
                    size: '2.4 MB',
                    status: 'Ready'
                },
                {
                    name: 'Soil Health Assessment - Zone A',
                    type: 'Soil Health',
                    date: 'Dec 25, 2025',
                    size: '1.8 MB',
                    status: 'Ready'
                },
                {
                    name: 'Water Usage Report - December',
                    type: 'Water Management',
                    date: 'Dec 20, 2025',
                    size: '1.5 MB',
                    status: 'Ready'
                }
            ];
            await Report.insertMany(initialReports);
            await Config.create({ key: 'reports_seeded', value: true });
            reports = await Report.find().sort({ createdAt: -1 });
        }

        res.json(reports);
    } catch (error) {
        next(error);
    }
};

export const generateReport = async (req, res, next) => {
    try {
        const { reportType } = req.body;

        const newReport = new Report({
            name: `${reportType} - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
            type: reportType.split(' ')[0] + ' ' + (reportType.split(' ')[1] || ''),
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            size: (Math.random() * (3.0 - 1.0) + 1.0).toFixed(1) + ' MB',
            status: 'Ready'
        });

        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        next(error);
    }
};

export const deleteReport = async (req, res, next) => {
    try {
        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: 'Report deleted' });
    } catch (error) {
        next(error);
    }
};

// --- Community Hub Management ---

export const getPosts = async (req, res, next) => {
    try {
        let posts = await Post.find().sort({ createdAt: -1 });

        // Seed some initial posts if empty and not seeded
        const isSeeded = await Config.findOne({ key: 'community_seeded' });
        if (!isSeeded && posts.length === 0) {
            const initialPosts = [
                {
                    author: 'Rajesh Kumar',
                    location: 'Punjab',
                    content: 'Successfully implemented drip irrigation. Water usage reduced by 40%!',
                    category: 'Water Management',
                    verified: true,
                    likesCount: 24,
                    comments: [
                        { author: 'Suresh Raina', text: 'Great work!' },
                        { author: 'Dr. Mehta', text: 'Inspiring initiative 👏' }
                    ]
                },
                {
                    author: 'Priya Sharma',
                    location: 'Maharashtra',
                    content: 'AI disease detection helped save my tomato crop. Early detection is key!',
                    category: 'Crop Health',
                    verified: true,
                    likesCount: 45,
                    comments: [
                        { author: 'Anil K', text: 'This is so useful!' },
                        { author: 'Farmer John', text: 'Which tool did you use?' }
                    ]
                }
            ];
            await Post.insertMany(initialPosts);
            await Config.create({ key: 'community_seeded', value: true });
            posts = await Post.find().sort({ createdAt: -1 });
        }

        res.json(posts);
    } catch (error) {
        next(error);
    }
};

export const createPost = async (req, res, next) => {
    try {
        const { author, content, category, location } = req.body;
        const post = new Post({
            author: author || 'Global Farmer',
            content,
            category: category || 'General',
            location: location || 'Unknown',
            verified: false
        });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
};

export const likePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndUpdate(
            id,
            { $inc: { likesCount: 1 } },
            { new: true }
        );
        res.json(post);
    } catch (error) {
        next(error);
    }
};

export const addComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { author, text } = req.body;
        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({ author: author || 'Anonymous', text });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
};
