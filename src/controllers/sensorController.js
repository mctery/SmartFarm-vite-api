const Sensor = require('../models/sensorModel');
const asyncHandler = require('express-async-handler');

const getSensors = asyncHandler(async (req, res) => {
  console.log('getSensors called');
  const sensors = await Sensor.find({});
  res.json(sensors);
});

const getSensor = asyncHandler(async (req, res) => {
  console.log('getSensor called');
  const sensor = await Sensor.findById(req.params.id);
  if (!sensor) {
    res.status(404);
    throw new Error(`Sensor not found: ${req.params.id}`);
  }
  res.json(sensor);
});

const getDeviceSensor = asyncHandler(async (req, res) => {
  console.log('getDeviceSensor called');
  const { id, type } = req.params;
  const sensor = await Sensor.find({ device_id: id, sensor_type: type });
  res.json(sensor);
});

const getDeviceSensorById = asyncHandler(async (req, res) => {
  console.log('getDeviceSensorById called');
  const sensor = await Sensor.find({ device_id: req.params.id });
  res.json(sensor);
});

const createSensor = asyncHandler(async (req, res) => {
  console.log('createSensor called');
  const sensor = await Sensor.create(req.body);
  res.status(201).json(sensor);
});

const updateSensor = asyncHandler(async (req, res) => {
  console.log('updateSensor called');
  const { id } = req.params;
  const updatedSensor = await Sensor.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedSensor) {
    res.status(404);
    throw new Error(`Sensor not found: ${id}`);
  }
  res.json(updatedSensor);
});

const deleteSensor = asyncHandler(async (req, res) => {
  console.log('deleteSensor called');
  const sensor = await Sensor.findByIdAndDelete(req.params.id);
  if (!sensor) {
    res.status(404);
    throw new Error(`Sensor not found: ${req.params.id}`);
  }
  res.json(sensor);
});

module.exports = {
  getSensors,
  getSensor,
  getDeviceSensor,
  getDeviceSensorById,
  createSensor,
  updateSensor,
  deleteSensor,
};
