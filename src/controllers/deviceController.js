const Device = require('../models/deviceModel');
const SensorWidget = require('../models/sensorWidgetModel');
const asyncHandler = require('express-async-handler');
const logger = require('../config/logger');

let commandClient = null;
function setCommandClient(client) {
  commandClient = client;
}

const getDevices = asyncHandler(async (req, res) => {
  logger.debug('getDevices called');
  const page = parseInt(req.query?.page) || 0;
  const limit = parseInt(req.query?.limit) || 0;

  if (page > 0 && limit > 0) {
    const skip = (page - 1) * limit;
    const [devices, total] = await Promise.all([
      Device.find({ status: 'A' }).skip(skip).limit(limit),
      Device.countDocuments({ status: 'A' }),
    ]);
    return res.json({
      message: 'OK',
      data: devices,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }

  const devices = await Device.find({ status: 'A' });
  res.json({ message: 'OK', data: devices });
});

const getDevice = asyncHandler(async (req, res) => {
  logger.debug('getDevice called');
  const device = await Device.findById(req.params.id);
  if (!device) {
    res.status(404);
    throw new Error(`Device not found: ${req.params.id}`);
  }
  res.json({ message: 'OK', data: device });
});

const getDeviceUser = asyncHandler(async (req, res) => {
  logger.debug('getDeviceUser called');
  const query = { user_id: req.params.user_id, status: 'A' };
  const page = parseInt(req.query?.page) || 0;
  const limit = parseInt(req.query?.limit) || 0;

  if (page > 0 && limit > 0) {
    const skip = (page - 1) * limit;
    const [devices, total] = await Promise.all([
      Device.find(query).skip(skip).limit(limit),
      Device.countDocuments(query),
    ]);
    return res.json({
      message: 'OK',
      data: devices,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  }

  const device = await Device.find(query);
  res.json({ message: 'OK', data: device });
});

const createDevice = asyncHandler(async (req, res) => {
  logger.debug('createDevice called');
  req.body.status = 'A';

  const exists = await Device.findOne({ device_id: req.body.device_id });
  if (exists) {
    res.status(400);
    throw new Error('device_id already exists');
  }

  const device = await Device.create(req.body);
  await SensorWidget.create({ device_id: req.body.device_id });
  res.status(201).json({ message: 'OK', data: device });
});

const updateDevice = asyncHandler(async (req, res) => {
  logger.debug('updateDevice called');
  const { id } = req.params;
  const updateData = { ...req.body };

  if (typeof updateData.status === 'boolean') {
    updateData.status = updateData.status ? 'A' : 'D';
  }

  const updatedDevice = await Device.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedDevice) {
    res.status(404);
    throw new Error(`Device not found: ${id}`);
  }
  res.json({ message: 'OK', data: updatedDevice });
});

const deleteDevice = asyncHandler(async (req, res) => {
  logger.debug('deleteDevice called');
  const device = await Device.findByIdAndUpdate(req.params.id, { status: 'D' }, { new: true });
  if (!device) {
    res.status(404);
    throw new Error(`Device not found: ${req.params.id}`);
  }
  res.json({ message: 'OK', data: device });
});

const sendDeviceCommand = asyncHandler(async (req, res) => {
  logger.debug('sendDeviceCommand called');
  const { id } = req.params;
  const { command, payload } = req.body;

  if (!commandClient) {
    res.status(503);
    throw new Error('MQTT not configured');
  }

  const topic = `request/${id}/${command}`;
  commandClient.publish(topic, JSON.stringify(payload || {}));
  res.json({ message: 'OK' });
});

module.exports = {
  getDevices,
  getDevice,
  getDeviceUser,
  createDevice,
  updateDevice,
  deleteDevice,
  sendDeviceCommand,
  setCommandClient,
};
