const express = require('express');
const { getSensorWidget, createSensorWidget, updateSensorWidget, deleteSensorWidget } = require('../controllers/sensorWidgetController')

const router = express.Router();

router.get('/:device_id', getSensorWidget);

// create a product
router.post('/', createSensorWidget);
// update a product
router.post('/update/:device_id', updateSensorWidget);
// delete a product
router.delete('/:device_id', deleteSensorWidget);

module.exports = router;
