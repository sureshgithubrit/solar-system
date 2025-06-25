# Solar System API

A Node.js REST API to explore planets in the solar system, built with Express and MongoDB. Includes endpoints for planet lookup, system info, and health checks. Unit tests are provided and run in CI with GitHub Actions.

## Features
- Lookup planet details by ID
- System info endpoint
- Liveness and readiness endpoints
- MongoDB integration
- Unit tests with in-memory MongoDB
- GitHub Actions workflow for CI and test artifact upload

## Endpoints

### POST `/planet`
- **Description:** Get planet details by ID
- **Body:** `{ "id": <number> }`
- **Response:** 200 with planet object, 400 if missing ID, 404 if not found

### GET `/os`
- **Description:** Returns system info (platform, arch, CPU count)

### GET `/live`
- **Description:** Liveness probe

### GET `/ready`
- **Description:** Readiness probe

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or connection string)

### Install
```bash
npm install
```

### Run Locally
```bash
npm start
```

### Run Tests
```bash
npm test
```

## Project Structure
- `app.js` - Main Express app
- `models/Planet.js` - Mongoose model for planets
- `app-test.js` - Test suite (Mocha/Chai, in-memory MongoDB)
- `.github/workflows/nodejs-ci.yml` - GitHub Actions workflow

## CI/CD
- On push or PR to `main`, tests run and a JUnit report is uploaded as an artifact.

## License
MIT

