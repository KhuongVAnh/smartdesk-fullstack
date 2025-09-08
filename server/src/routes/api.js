const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

const deviceController = require('../controllers/devicesControllers');
const telemetryController = require('../controllers/telemetryController');
const { genAllReadings, genLastestReading, genReadingByDate } = require('../controllers/APIcontroller')

// endpoint register device
router.post('/devices/register', deviceController.register);

// endpoint telemetry
router.post('/telemetry', telemetryController.ingest);

// API: lấy readings theo device_id
router.get('/readings/:device_id', genAllReadings);

// Lấy reading mới nhất của 1 device
router.get('/readings/:device_id/latest', genLastestReading);

// Lấy readings trong khoảng thời gian
router.get('/readings/:device_id/range', genReadingByDate);


module.exports = router;
