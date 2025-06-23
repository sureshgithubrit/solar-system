// models/Planet.js
const mongoose = require('mongoose');

const planetSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
});

// Option 1: Directly export the model
module.exports = mongoose.model('Planet', planetSchema);

// Option 2 (Safer, to prevent re-compilation in certain edge cases):
// module.exports = mongoose.models.Planet || mongoose.model('Planet', planetSchema);
// Use Option 1 first, it's generally fine if you consistently require this file.