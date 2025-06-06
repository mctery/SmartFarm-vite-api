const Device = require('../models/device.model')
const SensorWidget = require('../models/sensorWidget')
const asyncHandler = require('express-async-handler')

// get all product
const getDevices = asyncHandler(async(req, res) => {
    try {
        const devices = await Device.find({ status: 'A' });
        res.status(200).json(devices);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// get a single product
const getDevice = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const device = await Device.findById(id);
        res.status(200).json(device);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const getDeviceUser = asyncHandler(async(req, res) =>{
    try {
        const { user_id } = req.params;
        const device = await Device.find({ user_id: user_id, status: 'A' });
        res.status(200).json(device);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// create a product
const createDevice = asyncHandler(async(req, res) => {
    try {
        req.body.status = 'A'
        const device = await Device.create(req.body)
        await SensorWidget.create({ device_id: req.body.device_id })
        res.status(200).json(device);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// update a product
const updateDevice = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const device = await Device.findByIdAndUpdate(id, req.body);
        // we cannot find any product in database
        if(!device){
            res.status(404);
            throw new Error(`cannot find any product with ID ${id}`);
        }
        const updatedDevice = await Device.findById(id);
        res.status(200).json(updatedDevice);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const deleteDevice = asyncHandler(async(req, res) =>{
    try {
        const { id } = req.params;
        console.log(id)
        const device = await Device.findByIdAndUpdate(id, { status: 'D' });
        if(!device){
            res.status(404);
            throw new Error(`cannot find any product with ID ${id}`);
        }

        res.status(200).json(device);
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

module.exports = {
    getDevices,
    getDevice,
    getDeviceUser,
    createDevice,
    updateDevice,
    deleteDevice
}