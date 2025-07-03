const Sensor = require("../models/sensorModel");
const asyncHandler = require("express-async-handler");

// get all product
const getSensors = asyncHandler(async (req, res) => {
  console.log('getSensors called');
  try {
    const sensors = await Sensor.find({});
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// get a single product
const getSensor = asyncHandler(async (req, res) => {
  console.log('getSensor called');
  try {
    const { id } = req.params;
    const sensor = await Sensor.findById(id);
    if (!sensor) {
      res.status(404);
      throw new Error(`cannot find ID ${id}`);
    }
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getDeviceSensor = asyncHandler(async (req, res) => {
  console.log('getDeviceSensor called');
  try {
    const { id, type } = req.params;
    const query = { device_id: id, sensor_type: type };
    const sensor = await Sensor.find(query);
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const getDeviceSensorById = asyncHandler(async (req, res) => {
  console.log('getDeviceSensorById called');
  try {
    const { id } = req.params;
    const query = { device_id: id };
    console.log('Query:', query);
    const sensor = await Sensor.find(query);
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// create a product
const createSensor = asyncHandler(async (req, res) => {
  console.log('createSensor called');
  try {
    const sensor = await Sensor.create(req.body);
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// update a product
const updateSensor = asyncHandler(async (req, res) => {
  console.log('updateSensor called');
  try {
    const { id } = req.params;
    const sensor = await Sensor.findByIdAndUpdate(id, req.body);
    // we cannot find any product in database
    if (!sensor) {
      res.status(404);
      throw new Error(`cannot find any product with ID ${id}`);
    }
    const updatedSensor = await Sensor.findById(id);
    res.status(200).json(updatedSensor);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

const deleteSensor = asyncHandler(async (req, res) => {
  console.log('deleteSensor called');
  try {
    const { id } = req.params;
    const sensor = await Sensor.findByIdAndDelete(id);
    if (!sensor) {
      res.status(404);
      throw new Error(`cannot find any product with ID ${id}`);
    }
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
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
