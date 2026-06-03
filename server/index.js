const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios'); // Combined here at the top
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

// [Public] News Route - THIS IS THE NEW PART
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

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));