const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const Project = require('../models/Project');

// @route    POST api/projects
// @desc     Create a project
router.post('/', auth, async (req, res) => {
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
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/projects
// @desc     Get all user's projects
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id }).sort({ date: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;