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

    // Test: POST /planet with valid id returns planet
    it('should return planet for valid id', (done) => {
        chai.request(server)
            .post('/planet')
            .send({ id: 3 })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('name').eql('Earth');
                done();
            });
    });

    // Test: POST /planet with missing id returns 400
    it('should return 400 for missing id', (done) => {
        chai.request(server)
            .post('/planet')
            .send({})
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    // Test: POST /planet with unknown id returns 404
    it('should return 404 for unknown id', (done) => {
        chai.request(server)
            .post('/planet')
            .send({ id: 999 })
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });

    // Test: GET /os returns system info
    it('should return system info for /os', (done) => {
        chai.request(server)
            .get('/os')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('platform');
                res.body.should.have.property('arch');
                res.body.should.have.property('cpus');
                done();
            });
    });

    // Test: GET /live returns live status
    it('should return live status for /live', (done) => {
        chai.request(server)
            .get('/live')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql('live');
                done();
            });
    });

    // Test: GET /ready returns ready status
    it('should return ready status for /ready', (done) => {
        chai.request(server)
            .get('/ready')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql('ready');
                done();
            });
    });
});