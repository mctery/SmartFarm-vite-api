const express = require('express');
const {
  getSensorWidget,
  createSensorWidget,
  updateSensorWidget,
  deleteSensorWidget,
} = require('../controllers/sensorWidgetController');

const router = express.Router();

router
  .route('/:device_id')
  .get(getSensorWidget)
  .delete(deleteSensorWidget);

router.post('/', createSensorWidget);
router.post('/update/:device_id', updateSensorWidget);

module.exports = router;
