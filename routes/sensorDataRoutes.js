const express = require('express');
const { createSensorDataValue, getSensorData } = require('../controllers/sensorDataController');

const router = express.Router();

router.route('/find').post(getSensorData);
router.route('/create').post(createSensorDataValue);

module.exports = router;
