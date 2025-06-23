let mongoose = require("mongoose");
let { MongoMemoryServer } = require('mongodb-memory-server'); // Import MongoMemoryServer
let server = require("../app"); // Your Express app
let chai = require("chai");
let chaiHttp = require("chai-http");

// Assertion
chai.should();
chai.use(chaiHttp);

// Define a simple Planet Schema and Model (must be the same as in app.js for tests to work with it)
const planetSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, unique: true },
});
const Planet = mongoose.model('Planet', planetSchema); // Ensure this model is defined or accessible

let mongoServer; // Declare mongoServer outside to manage its lifecycle

// Data to seed the in-memory database
const initialPlanets = [
    { id: 1, name: 'Mercury' },
    { id: 2, name: 'Venus' },
    { id: 3, name: 'Earth' },
    { id: 4, name: 'Mars' },
    { id: 5, name: 'Jupiter' },
    { id: 6, name: 'Saturn' },
    { id: 7, name: 'Uranus' },
    { id: 8, name: 'Neptune' },
    { id: 9, name: 'Pluto' } // Added Pluto for testing (if uncommented)
];

describe('Planets API Suite', () => {

    // Before all tests in this suite, start the in-memory MongoDB
    before(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`In-memory MongoDB started at: ${uri}`);
        // Seed the database with initial data
        await Planet.insertMany(initialPlanets);
        console.log('Database seeded with initial planets.');
    });

    // After all tests in this suite, stop the in-memory MongoDB and disconnect Mongoose
    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
        console.log('In-memory MongoDB stopped and disconnected.');
    });

    // Before each test, you could clear the collection if needed for strict isolation,
    // but for read-only tests like these, seeding once is fine.
    // beforeEach(async () => {
    //     await Planet.deleteMany({}); // Clear existing data
    //     await Planet.insertMany(initialPlanets); // Re-seed
    // });

    describe('Fetching Planet Details', () => {
        it('it should fetch a planet named Mercury', (done) => {
            let payload = { id: 1 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(1);
                    res.body.should.have.property('name').eql('Mercury');
                    done();
                });
        });

        it('it should fetch a planet named Venus', (done) => {
            let payload = { id: 2 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(2);
                    res.body.should.have.property('name').eql('Venus');
                    done();
                });
        });

        it('it should fetch a planet named Earth', (done) => {
            let payload = { id: 3 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(3);
                    res.body.should.have.property('name').eql('Earth');
                    done();
                });
        });
        it('it should fetch a planet named Mars', (done) => {
            let payload = { id: 4 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(4);
                    res.body.should.have.property('name').eql('Mars');
                    done();
                });
        });

        it('it should fetch a planet named Jupiter', (done) => {
            let payload = { id: 5 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(5);
                    res.body.should.have.property('name').eql('Jupiter');
                    done();
                });
        });

        it('it should fetch a planet named Saturn', (done) => {
            let payload = { id: 6 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(6);
                    res.body.should.have.property('name').eql('Saturn');
                    done();
                });
        });

        it('it should fetch a planet named Uranus', (done) => {
            let payload = { id: 7 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(7);
                    res.body.should.have.property('name').eql('Uranus');
                    done();
                });
        });

        it('it should fetch a planet named Neptune', (done) => {
            let payload = { id: 8 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(8);
                    res.body.should.have.property('name').eql('Neptune');
                    done();
                });
        });

        // Uncomment this if you add Pluto to your initial data and expect it
        it('it should fetch a planet named Pluto', (done) => {
            let payload = { id: 9 }
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('id').eql(9);
                    res.body.should.have.property('name').eql('Pluto'); // Changed from 'Sun' to 'Pluto' based on ID 9
                    done();
                });
        });

         it('it should return 404 for a non-existent planet', (done) => {
            let payload = { id: 99 } // A non-existent ID
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('Planet not found');
                    done();
                });
        });

         it('it should return 400 if ID is missing', (done) => {
            let payload = { } // Missing ID
            chai.request(server)
                .post('/planet')
                .send(payload)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Planet ID is required');
                    done();
                });
        });
    });

    describe('Testing Other Endpoints', () => {

        describe('it should fetch OS Details', () => {
            it('it should fetch OS details', (done) => {
                chai.request(server)
                    .get('/os')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.an('object'); // Expect an object
                        res.body.should.have.property('platform'); // Check for common properties
                        done();
                    });
            });
        });

        describe('it should fetch Live Status', () => {
            it('it checks Liveness endpoint', (done) => {
                chai.request(server)
                    .get('/live')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('status').eql('live');
                        done();
                    });
            });
        });

        describe('it should fetch Ready Status', () => {
            it('it checks Readiness endpoint', (done) => {
                chai.request(server)
                    .get('/ready')
                    .end((err, res) => {
                        res.should.have.status(200); // Should be 200 because DB is connected by before() hook
                        res.body.should.have.property('status').eql('ready');
                        done();
                    });
            });
        });

    });
});