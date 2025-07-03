const SensorData = require('../models/sensorDataModel')
const asyncHandler = require('express-async-handler')

const getSensorData = asyncHandler(async(req, res) => {
    console.log('getSensorData called');
    try {
        const payload = req.body
        const sensors = await SensorData.find({ device_id: payload.device_id, sensor: payload.sensor })
        res.status(200).json(sensors)
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

const getSensorDataRange = asyncHandler(async(req, res) => {
    console.log('getSensorDataRange called');
    try {
        const { device_id, sensor, startDate, endDate } = req.body;
        const query = { device_id, sensor };
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        const sensors = await SensorData.find(query);
        res.status(200).json(sensors);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const createSensorDataValue = asyncHandler(async(req, res) => {
    console.log('createSensorDataValue called');
    try {
        const payload = req.body
        let collection = []
        if(payload.device_id && payload.dataset.length > 0) {
            payload.dataset.map(async (item, index) => {
                collection.push({
                    device_id: payload.device_id,
                    sensor_id: item.id,
                    sensor: item.sensor,
                    value: item.value,
                    status: 'A'
                })
            })
            const result = await SensorData.create(collection)
            res.status(200).json({ message: 'OK', data: collection })
        } else {
            res.status(200).json({ message: 'ERROR', data: 'Not Found' })
        }
    } catch (error) {
        res.status(500).json({ message: 'ERROR', data: error })
        throw new Error(error.message)
    }
})

module.exports = {
    getSensorData,
    createSensorDataValue,
    getSensorDataRange
}
