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
                total_farms: 0,
                total_crops: 0,
                recent_detections: 0,
                active_schedules: 0
            },
            alerts: []
        });
    } catch (error) {
        next(error);
    }
};

export const detectCropDisease = async (req, res, next) => {
    try {
        // Return null/empty result when no specific analysis is performed
        res.json(null);
    } catch (error) {
        next(error);
    }
};

export const getMarketForecast = async (req, res, next) => {
    try {
        // Return empty result to comply with "No Demo Data" rule
        res.json({});
    } catch (error) {
        next(error);
    }
};


// In-memory storage for shipments (simulated database)
let activeShipments = [];

export const getSupplyChainData = async (req, res, next) => {
    try {
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

        if (pests.length === 0) {
            // Provide a comprehensive list of 25 pests if database is empty
            pests = [
                { name: 'Aphids', severity: 'Medium', crops: ['Tomato', 'Cucumber', 'Peas'], organicControl: ['Neem Oil Spray', 'Ladybugs', 'Soap Water'], chemicalControl: 'Imidacloprid', image: '🐛' },
                { name: 'Locusts', severity: 'High', crops: ['Wheat', 'Maize', 'Rice'], organicControl: ['Metarhizium acridum', 'Trenching'], chemicalControl: 'Malathion', image: '🦗' },
                { name: 'Whitefly', severity: 'High', crops: ['Cotton', 'Tomato', 'Potato'], organicControl: ['Yellow Sticky Traps', 'Neem Oil'], chemicalControl: 'Acetamiprid', image: '🦋' },
                { name: 'Fall Armyworm', severity: 'High', crops: ['Maize', 'Sugarcane', 'Rice'], organicControl: ['Pheromone Traps', 'Bt spray'], chemicalControl: 'Spinosad', image: '🐛' },
                { name: 'Spider Mites', severity: 'Medium', crops: ['Beans', 'Strawberry', 'Roses'], organicControl: ['Water Jetting', 'Predatory Mites'], chemicalControl: 'Abamectin', image: '🕷️' },
                { name: 'Thrips', severity: 'Medium', crops: ['Onion', 'Chillies', 'Grapes'], organicControl: ['Blue Sticky Traps', 'Neem oil'], chemicalControl: 'Spinetoram', image: '🪲' },
                { name: 'Mealybugs', severity: 'Medium', crops: ['Papaya', 'Hibiscus', 'Mango'], organicControl: ['Alcohol rub', 'Cryptolaemus beetles'], chemicalControl: 'Buprofezin', image: '🌫️' },
                { name: 'Rice Weevil', severity: 'Low', crops: ['Stored Rice', 'Wheat', 'Maize'], organicControl: ['Drying under sun', 'Neem leaves'], chemicalControl: 'Phosphine fumigation', image: '🪲' },
                { name: 'Fruit Borer', severity: 'High', crops: ['Brinjal', 'Tomato', 'Okra'], organicControl: ['Pheromone traps', 'Trichogramma cards'], chemicalControl: 'Chlorantraniliprole', image: '🐛' },
                { name: 'Cutworm', severity: 'Medium', crops: ['Potato', 'Tobacco', 'Corn'], organicControl: ['Collars around stems', 'Handpicking'], chemicalControl: 'Cypermethrin', image: '🐛' },
                { name: 'Leafhopper', severity: 'Medium', crops: ['Potato', 'Cotton', 'Grains'], organicControl: ['Sticky traps', 'Neem spray'], chemicalControl: 'Fipronil', image: '🦟' },
                { name: 'Root Knot Nematode', severity: 'High', crops: ['Carrot', 'Tomato', 'Okra'], organicControl: ['Crop rotation with Marigold', 'Solarization'], chemicalControl: 'Fluopyram', image: '🪱' },
                { name: 'Scale Insects', severity: 'Medium', crops: ['Citrus', 'Apple', 'Ornamentals'], organicControl: ['Horticultural oils', 'Scraping'], chemicalControl: 'Dinotefuran', image: '🐚' },
                { name: 'Wireworms', severity: 'High', crops: ['Potato', 'Maize', 'Carrot'], organicControl: ['Tilling soil', 'Potato traps'], chemicalControl: 'Bifenthrin', image: '🐛' },
                { name: 'Japanese Beetle', severity: 'High', crops: ['Soybean', 'Corn', 'Fruit Trees'], organicControl: ['Handpicking', 'Milky spore'], chemicalControl: 'Carbaryl', image: '🪲' },
                { name: 'Cabbage Looper', severity: 'Medium', crops: ['Cabbage', 'Broccoli', 'Kale'], organicControl: ['Bt spray', 'Floating row covers'], chemicalControl: 'Indoxacarb', image: '🐛' },
                { name: 'Colorado Potato Beetle', severity: 'High', crops: ['Potato', 'Tomato', 'Eggplant'], organicControl: ['Crop rotation', 'Straw mulch'], chemicalControl: 'Abamectin', image: '🪲' },
                { name: 'Diamondback Moth', severity: 'High', crops: ['Cabbage', 'Cauliflower', 'Mustard'], organicControl: ['Sticky traps', 'Bt spray'], chemicalControl: 'Chlorantraniliprole', image: '🦋' },
                { name: 'Brown Planthopper', severity: 'High', crops: ['Rice'], organicControl: ['Proper spacing', 'Azyadirachtin'], chemicalControl: 'Pymetrozine', image: '🦗' },
                { name: 'Pink Bollworm', severity: 'High', crops: ['Cotton'], organicControl: ['Pheromone traps', 'Field sanitation'], chemicalControl: 'Emamectin Benzoate', image: '🐛' },
                { name: 'Citrus Psylla', severity: 'Medium', crops: ['Orange', 'Lemon', 'Pomelo'], organicControl: ['Oil sprays', 'Pruning infested parts'], chemicalControl: 'Thiamethoxam', image: '🦟' },
                { name: 'Stem Borer', severity: 'High', crops: ['Rice', 'Maize', 'Sugarcane'], organicControl: ['Pheromone traps', 'Light traps'], chemicalControl: 'Cartap Hydrochloride', image: '🐛' },
                { name: 'Grasshopper', severity: 'Medium', crops: ['Grains', 'Vegetables', 'Trees'], organicControl: ['Birds/Poultry', 'Tilling'], chemicalControl: 'Lambda-cyhalothrin', image: '🦗' },
                { name: 'Bollworm', severity: 'High', crops: ['Cotton', 'Pigeon Pea'], organicControl: ['NPV spray', 'Handpicking'], chemicalControl: 'Profenofos', image: '🐛' },
                { name: 'Armyworm', severity: 'High', crops: ['Rice', 'Maize', 'Millets'], organicControl: ['Trenches', 'Deep plowing'], chemicalControl: 'Quinalphos', image: '🐛' }
            ];
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
        const reports = await Report.find().sort({ createdAt: -1 });
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
        const posts = await Post.find().sort({ createdAt: -1 });
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
