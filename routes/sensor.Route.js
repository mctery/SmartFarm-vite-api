const express = require('express');
const Sensor = require('../models/sensor.model')
const {getSensors, getSensor, createSensor, updateSensor, deleteSensor, getDeviceSensor} = require('../controllers/sensor.Controller')

const router = express.Router();

router.get('/', getSensors);

router.get('/:id', getSensor);

// Retrieve sensors by device id and sensor type. Optionally filter by version
// when the version parameter is provided.
router.get('/device/type/:id/:type/:version?', getDeviceSensor);

router.post('/', createSensor);
// update a product
router.put('/:id', updateSensor);
// delete a product
router.delete('/:id', deleteSensor);

module.exports = router;
