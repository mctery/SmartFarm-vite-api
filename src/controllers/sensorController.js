const Sensor = require('../models/sensorModel');
const asyncHandler = require('express-async-handler');
const logger = require('../config/logger');

const getSensors = asyncHandler(async (req, res) => {
  logger.debug('getSensors called');
  const sensors = await Sensor.find({ status: 'A' });
  res.json({ message: 'OK', data: sensors });
});

const getSensor = asyncHandler(async (req, res) => {
  logger.debug('getSensor called');
  const sensor = await Sensor.findById(req.params.id);
  if (!sensor) {
    res.status(404);
    throw new Error(`Sensor not found: ${req.params.id}`);
  }
  res.json({ message: 'OK', data: sensor });
});

const getDeviceSensor = asyncHandler(async (req, res) => {
  logger.debug('getDeviceSensor called');
  const { id, type } = req.params;
  const sensor = await Sensor.find({ device_id: id, sensor_type: type, status: 'A' });
  res.json({ message: 'OK', data: sensor });
});

const getDeviceSensorById = asyncHandler(async (req, res) => {
  logger.debug('getDeviceSensorById called');
  const sensor = await Sensor.find({ device_id: req.params.id, status: 'A' });
  res.json({ message: 'OK', data: sensor });
});

const createSensor = asyncHandler(async (req, res) => {
  logger.debug('createSensor called');
  if (typeof req.body.status === 'boolean') {
    req.body.status = req.body.status ? 'A' : 'D';
  }
  if (!req.body.status) {
    req.body.status = 'A';
  }
  const sensor = await Sensor.create(req.body);
  res.status(201).json({ message: 'OK', data: sensor });
});

const updateSensor = asyncHandler(async (req, res) => {
  logger.debug('updateSensor called');
  const { id } = req.params;
  const updateData = { ...req.body };
  if (typeof updateData.status === 'boolean') {
    updateData.status = updateData.status ? 'A' : 'D';
  }
  const updatedSensor = await Sensor.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedSensor) {
    res.status(404);
    throw new Error(`Sensor not found: ${id}`);
  }
  res.json({ message: 'OK', data: updatedSensor });
});

const deleteSensor = asyncHandler(async (req, res) => {
  logger.debug('deleteSensor called');
  const sensor = await Sensor.findByIdAndUpdate(
    req.params.id,
    { status: 'D' },
    { new: true }
  );
  if (!sensor) {
    res.status(404);
    throw new Error(`Sensor not found: ${req.params.id}`);
  }
  res.json({ message: 'OK', data: sensor });
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
