const SensorWidget = require('../models/sensorWidgetModel');
const asyncHandler = require('express-async-handler');

const getSensorWidget = asyncHandler(async (req, res) => {
  console.log('getSensorWidget called');
  const result = await SensorWidget.find({ device_id: req.params.device_id });
  res.json(result);
});

const createSensorWidget = asyncHandler(async (req, res) => {
  console.log('createSensorWidget called');
  const result = await SensorWidget.create(req.body);
  res.status(201).json(result);
});

const updateSensorWidget = asyncHandler(async (req, res) => {
  console.log('updateSensorWidget called');
  const { device_id } = req.params;
  const updatedWidget = await SensorWidget.findOneAndUpdate(
    { device_id },
    { widget_json: JSON.stringify(req.body) },
    { new: true }
  );
  if (!updatedWidget) {
    res.status(404);
    throw new Error(`SensorWidget not found: ${device_id}`);
  }
  console.log(`Updated widget for device ${device_id}`);
  res.json(updatedWidget);
});

const deleteSensorWidget = asyncHandler(async (req, res) => {
  console.log('deleteSensorWidget called');
  const { device_id } = req.params;
  const result = await SensorWidget.findOneAndUpdate({ device_id }, { status: 'D' });
  if (!result) {
    res.status(404);
    throw new Error(`SensorWidget not found: ${device_id}`);
  }
  res.json(result);
});

module.exports = {
  getSensorWidget,
  createSensorWidget,
  updateSensorWidget,
  deleteSensorWidget,
};
