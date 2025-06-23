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
app.use(express.json());

// MongoDB Connection (for development/production, handled by test setup for tests)
// ... (your existing connection logic) ...

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

// ... (other routes like /os, /live, /ready) ...

module.exports = app;