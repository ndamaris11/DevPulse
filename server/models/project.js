const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users' // This links the project to the specific person logged in
    },
    name: {
        type: String,
        required: true
    },
    techStack: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'Planned'],
        default: 'Planned'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('project', ProjectSchema);