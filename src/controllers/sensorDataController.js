const SensorData = require('../models/sensorDataModel');
const asyncHandler = require('express-async-handler');

const getSensorData = asyncHandler(async (req, res) => {
  console.log('getSensorData called');
  const { device_id, sensor } = req.body;
  const sensors = await SensorData.find({ device_id, sensor });
  res.json(sensors);
});

const getSensorDataRange = asyncHandler(async (req, res) => {
  console.log('getSensorDataRange called');
  const { device_id, sensor, startDate, endDate } = req.body;
  const query = { device_id, sensor };
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }
  const sensors = await SensorData.find(query);
  res.json(sensors);
});

const createSensorDataValue = asyncHandler(async (req, res) => {
  console.log('createSensorDataValue called');
  const { device_id, dataset } = req.body;

  if (!device_id || !dataset || dataset.length === 0) {
    res.status(400);
    throw new Error('device_id and dataset are required');
  }

  const collection = dataset.map((item) => ({
    device_id,
    sensor_id: item.id,
    sensor: item.sensor,
    value: item.value,
  }));

  const result = await SensorData.create(collection);
  res.status(201).json({ message: 'OK', data: result });
});

const getAggregateSensorData = asyncHandler(async (req, res) => {
  console.log('getAggregateSensorData called');
  const { device_id, sensor, sensor_id, startDate, endDate, groupBy } = req.body;

  if (!device_id || !sensor) {
    res.status(400);
    throw new Error('device_id and sensor are required');
  }

  const match = { device_id, sensor };
  if (sensor_id) match.sensor_id = sensor_id;
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  let dateGroup;
  if (groupBy === 'day') {
    dateGroup = {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
      day: { $dayOfMonth: '$createdAt' },
    };
  } else {
    dateGroup = {
      year: { $year: '$createdAt' },
      month: { $month: '$createdAt' },
      day: { $dayOfMonth: '$createdAt' },
      hour: { $hour: '$createdAt' },
    };
  }

  const pipeline = [
    { $match: match },
    { $addFields: { numericValue: { $toDouble: '$value' } } },
    {
      $group: {
        _id: dateGroup,
        avg: { $avg: '$numericValue' },
        min: { $min: '$numericValue' },
        max: { $max: '$numericValue' },
        count: { $sum: 1 },
        time: { $first: '$createdAt' },
      },
    },
    { $sort: { time: 1 } },
    {
      $project: {
        _id: 0,
        time: 1,
        avg: { $round: ['$avg', 2] },
        min: { $round: ['$min', 2] },
        max: { $round: ['$max', 2] },
        count: 1,
      },
    },
  ];

  const result = await SensorData.aggregate(pipeline);
  res.json({ message: 'OK', data: result });
});

module.exports = {
  getSensorData,
  createSensorDataValue,
  getSensorDataRange,
  getAggregateSensorData,
};
