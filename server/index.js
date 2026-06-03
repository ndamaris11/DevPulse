const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); 
require('dotenv').config();

const app = express();

// 1. Models
const User = require('./models/User');
const Project = require('./models/Project');

// 2. Middleware
app.use(express.json());
app.use(cors());

// --- AUTH MIDDLEWARE ---
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'devpulse_secret_key_2026');
        req.user = { id: decoded.userId };
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// 3. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.log("❌ Connection Error:", err));

// 4. Routes

// [Public] News Route
app.get('/api/news', async (req, res) => {
    try {
        const apiKey = process.env.NEWS_API_KEY; 
        const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${apiKey}`;
        const response = await axios.get(url);
        res.json(response.data.articles.slice(0, 5));
    } catch (err) {
        console.error("News API Error:", err.message);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

// [Public] Base Route
app.get('/', (req, res) => res.send("DevPulse API is running..."));

// [Public] Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// [Public] Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET || 'devpulse_secret_key_2026', 
            { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            user: { username: user.username, email: user.email } 
        });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// [Private] Add a Project
app.post('/api/projects', auth, async (req, res) => {
    try {
        const { name, techStack, status } = req.body;
        const newProject = new Project({
            name,
            techStack,
            status,
            user: req.user.id
        });
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// [Private] Get All My Projects
app.get('/api/projects', auth, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id }).sort({ date: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🚀 [Private] New AI Stack Analysis Endpoint 
app.post('/api/projects/:id/analyze', auth, async (req, res) => {
    try {
        // Find the project and verify ownership
        const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
        if (!project) return res.status(404).json({ message: "Project not found or unauthorized" });

        // Normalize string for consistent mock parsing rules
        const stack = (project.techStack || '').toLowerCase();

        // Structural content data matrix mapping standard stack frameworks to modern market metrics
        let score = 78;
        let marketTrends = "Stable framework choices. Consider exploring native cloud architecture updates or real-time microservices extensions to expand architectural scaling depth.";
        let targetAudience = "General enterprise operational teams, business systems integration hubs, and standard SaaS application consumers looking for reliable cloud tools.";
        let roadblocks = "Potential scalability bounds during peak concurrent state load thresholds. Ensure structural data mutations are indexed inside MongoDB.";

        if (stack.includes('mern') || stack.includes('react') || stack.includes('node')) {
            score = 92;
            marketTrends = "High demand footprint for full-stack JavaScript frameworks. Single-page applications scaling seamlessly across edge distribution setups remain highly favorable.";
            targetAudience = "Modern early-stage tech ventures, fast-paced consumer application products, and engineering teams building real-time collaboration engines.";
            roadblocks = "State management complexity overhead and heavy asset optimization constraints. Keep dependencies updated to mitigate security vulnerabilities.";
        } else if (stack.includes('java') || stack.includes('spring')) {
            score = 86;
            marketTrends = "Highly reliable, classic industry choice for high-volume database workloads. Microservice ecosystems dominate corporate banking and core internal systems layouts.";
            targetAudience = "Large enterprise corporate systems, logistics processing layers, automated data engines, and legacy code infrastructure modernizations.";
            roadblocks = "Extended release-to-production deployment cycles and dense codebase boilerplate overhead. Monolithic designs can slow down feature agility.";
        }

        // Apply analysis object values natively to the project schema instance
        project.aiAnalysis = {
            score,
            marketTrends,
            targetAudience,
            roadblocks,
            analyzedAt: new Date()
        };

        await project.save();
        res.json(project);
    } catch (err) {
        console.error("AI Analysis Route Error:", err.message);
        res.status(500).send("Server calculation failure");
    }
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));