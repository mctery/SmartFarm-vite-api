const express = require('express');
const { createSensorDataValue, getSensorData, getSensorDataRange } = require('../controllers/sensorDataController');

const router = express.Router();

router.route('/find').post(getSensorData);
router.route('/range').post(getSensorDataRange);
router.route('/create').post(createSensorDataValue);

module.exports = router;
