// app-test.js
let mongoose = require("mongoose");
let { MongoMemoryServer } = require('mongodb-memory-server');
let server = require("./app"); // Your Express app
let chai = require("chai");
let chaiHttp = require("chai-http");

// Assertion
chai.should();
chai.use(chaiHttp);

// --- REMOVE THE PLANET SCHEMA & MODEL DEFINITION FROM HERE (Lines that caused error) ---
// Instead, require it, ensuring you use the SAME model definition
const Planet = require('./models/Planet'); // Adjust path to match where you put models/Planet.js

let mongoServer;

const initialPlanets = [
    { id: 1, name: 'Mercury' },
    { id: 2, name: 'Venus' },
    { id: 3, name: 'Earth' },
    { id: 4, name: 'Mars' },
    { id: 5, name: 'Jupiter' },
    { id: 6, name: 'Saturn' },
    { id: 7, name: 'Uranus' },
    { id: 8, name: 'Neptune' },
    { id: 9, name: 'Pluto' }
];

describe('Planets API Suite', () => {

    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`In-memory MongoDB started at: ${uri}`);
        await Planet.insertMany(initialPlanets); // Use the imported Planet model
        console.log('Database seeded with initial planets.');
    });

    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        console.log('In-memory MongoDB stopped and disconnected.');
    });

    // ... (rest of your tests remain the same) ...
});