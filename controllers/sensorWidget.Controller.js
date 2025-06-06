const SensorWidget = require('../models/sensorWidget')
const asyncHandler = require('express-async-handler')

const getSensorWidget = asyncHandler(async(req, res) =>{
    try {
        const { device_id } = req.params;
        const result = await SensorWidget.find({ device_id: device_id});
        res.status(200).json(result);
    } catch (error) {
        res.status(500);
        console.log(error.message)
        throw new Error(error.message);
    }
})

const createSensorWidget = asyncHandler(async(req, res) => {
    try {
        const result = await SensorWidget.create(req.body)
        res.status(200).json(result);
    } catch (error) {
        res.status(500);
        console.log(error.message)
        throw new Error(error.message);
    }
})

const updateSensorWidget = asyncHandler(async(req, res) => {
    try {
        const { device_id } = req.params
        const sanitizedBody = { ...req.body }
        if (sanitizedBody.password) {
            sanitizedBody.password = '[FILTERED]'
        }
        console.log(sanitizedBody)
        const result = await SensorWidget.findOneAndUpdate({ device_id: device_id}, {widget_json : JSON.stringify(req.body)});
        if(!result){
            res.status(404);
            throw new Error(`cannot find ID ${device_id}`);
        }
        const find = await SensorWidget.findById(device_id);
        res.status(200).json(find);
        
    } catch (error) {
        res.status(500);
        console.log(error.message)
        throw new Error(error.message);
    }
})

const deleteSensorWidget = asyncHandler(async(req, res) =>{
    try {
        const { device_id } = req.params;
        console.log(device_id)
        const result = await SensorWidget.findOneAndUpdate({ device_id: device_id}, { status: 'D' });
        if(!result){
            res.status(404);
            throw new Error(`cannot find ID ${device_id}`);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500);
        console.log(error.message)
        throw new Error(error.message);
    }
})

module.exports = {
    getSensorWidget,
    createSensorWidget,
    updateSensorWidget,
    deleteSensorWidget
}