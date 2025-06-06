const express = require('express');
const { getSensors, getSensor, createSensor, updateSensor, deleteSensor, getDeviceSensor } = require('../controllers/sensorController');

const router = express.Router();

router.get('/device/type/:id/:type/:version?', getDeviceSensor);

router
  .route('/')
  .get(getSensors)
  .post(createSensor);

router
  .route('/:id')
  .get(getSensor)
  .put(updateSensor)
  .delete(deleteSensor);

module.exports = router;
