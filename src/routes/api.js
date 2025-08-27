const express = require('express');
const router = express.Router();

const deviceController = require('../controllers/devicesControllers');
const telemetryController = require('../controllers/telemetryController');

// endpoint register device
router.post('/devices/register', deviceController.register);

// endpoint telemetry
router.post('/telemetry', telemetryController.ingest);

module.exports = router;
