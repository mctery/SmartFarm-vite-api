const express = require('express')
const { createSensorDataValue, getSensorData } = require('../controllers/sensorDataController')

const router = express.Router()

router.post('/find', getSensorData)
router.post('/create', createSensorDataValue)

module.exports = router
