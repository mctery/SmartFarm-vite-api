const SensorData = require('../models/sensorData.model')
const asyncHandler = require('express-async-handler')

const getSensorData = asyncHandler(async(req, res) => {
    try {
        const info = req.body
        const sensors = await SensorData.find({ device_id: info.device_id, sensor: info.sensor })
        res.status(200).json(sensors)
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

const createSensorDataValue = asyncHandler(async(req, res) => {
    try {
        const info = req.body
        let collection = []
        if(info.device_id && info.dataset.length > 0) {
            info.dataset.map(async (item, index) => {
                collection.push({
                    device_id: info.device_id,
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
    createSensorDataValue
}