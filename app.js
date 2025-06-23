// app.js (or server.js)
const express = require('express');
const mongoose = require('mongoose');
const os = require('os'); // For /os endpoint
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // To parse JSON request bodies

// Connect to MongoDB - **This connection will be managed by the test setup**
// For production, you'd use process.env.MONGO_URI or a direct string here.
// For testing, we'll override this or connect dynamically.
// We'll export `app` without directly connecting here so the test can control it.

// Define a simple Planet Schema and Model (assuming you have one)
const planetSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
});
const Planet = mongoose.model('Planet', planetSchema);

// Routes
app.post('/planet', async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'Planet ID is required' });
    }
    try {
        const planet = await Planet.findOne({ id: id });
        if (!planet) {
            return res.status(404).json({ message: 'Planet not found' });
        }
        res.status(200).json(planet);
    } catch (error) {
        console.error('Error fetching planet:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/os', (req, res) => {
    res.status(200).json({
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        uptime: os.uptime(),
    });
});

app.get('/live', (req, res) => {
    res.status(200).json({ status: 'live' });
});

app.get('/ready', (req, res) => {
    // In a real app, you'd check DB connection, external services, etc.
    if (mongoose.connection.readyState === 1) { // 1 means connected
        res.status(200).json({ status: 'ready' });
    } else {
        res.status(503).json({ status: 'not ready', message: 'DB not connected' });
    }
});

// Export the app for testing frameworks like Chai-HTTP
// For actual running, you'd have:
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;