import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
const axios = require('axios'); // Make sure axios is installed in backend: npm install axios

// [Private] Smart News Route - Filters by your project tech stack
app.get('/api/news', auth, async (req, res) => {
    try {
        // 1. Get the user's projects from MongoDB
        const projects = await Project.find({ user: req.user.id });
        
        // 2. Extract unique tech keywords (e.g., ["Java", "MERN", "React"])
        let keywords = ['technology']; // Default keyword
        if (projects.length > 0) {
            const allTech = projects.map(p => p.techStack.split(',')).flat();
            const cleanTech = allTech.map(t => t.trim());
            keywords = [...new Set(cleanTech)]; // Remove duplicates
        }

        // 3. Create a search query (e.g., "Java OR MERN OR React")
        const query = keywords.join(' OR ');
        const apiKey = process.env.NEWS_API_KEY;
        
        // We use the /everything endpoint for specific keyword searching
        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=relevance&pageSize=5&apiKey=${apiKey}`;
        
        const response = await axios.get(url);
        res.json(response.data.articles);
    } catch (err) {
        console.error("Smart News Error:", err.message);
        res.status(500).json({ error: "Failed to fetch personalized news" });
    }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
