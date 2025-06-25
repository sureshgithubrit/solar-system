// app.js (or server.js)
const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const app = express();
const PORT = process.env.PORT || 3000;

// --- REMOVE THE PLANET SCHEMA & MODEL DEFINITION FROM HERE ---
// Instead, require it
const Planet = require('./models/Planet'); // Adjust path based on your 'models' directory location

// Middleware
app.use(express.json())

// MongoDB Connection (for development/production, handled by test setup for tests)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/solar-system';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
    console.error('MongoDB connection error:', err);
    // Use process.exit only in main module
    if (require.main === module) process.exit(1);
});

// Routes
app.post('/planet', async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'Planet ID is required' });
    }
    try {
        const planet = await Planet.findOne({ id: id }); // Use the imported Planet model
        if (!planet) {
            return res.status(404).json({ message: 'Planet not found' });
        }
        res.status(200).json(planet);
    } catch (error) {
        console.error('Error fetching planet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add /os, /live, /ready routes
app.get('/os', (req, res) => {
    res.json({ platform: os.platform(), arch: os.arch(), cpus: os.cpus().length });
});

app.get('/live', (req, res) => {
    res.status(200).json({ status: 'live' });
});

app.get('/ready', (req, res) => {
    res.status(200).json({ status: 'ready' });
});

// Start the server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;