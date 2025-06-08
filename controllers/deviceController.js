const Device = require('../models/deviceModel')
const SensorWidget = require('../models/sensorWidgetModel')
const asyncHandler = require('express-async-handler')
const mqtt = require('mqtt')

let commandClient
if (process.env.MQTT_URL && process.env.NODE_ENV !== 'test') {
    commandClient = mqtt.connect(process.env.MQTT_URL)
}
function setCommandClient(client) {
    commandClient = client
}

// get all product
const getDevices = asyncHandler(async(req, res) => {
    console.log('getDevices called');
    try {
        const devices = await Device.find({ status: 'A' });
        res.status(200).json({ message: 'OK', data: devices });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// get a single product
const getDevice = asyncHandler(async(req, res) =>{
    console.log('getDevice called');
    try {
        const {id} = req.params;
        const device = await Device.findById(id);
        res.status(200).json({ message: 'OK', data: device });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const getDeviceUser = asyncHandler(async(req, res) =>{
    console.log('getDeviceUser called');
    try {
        const { user_id } = req.params;
        const device = await Device.find({ user_id: user_id, status: 'A' });
        res.status(200).json({ message: 'OK', data: device });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// create a product
const createDevice = asyncHandler(async(req, res) => {
    console.log('createDevice called');
    try {
        req.body.status = 'A'
        const device = await Device.create(req.body)
        await SensorWidget.create({ device_id: req.body.device_id })
        res.status(200).json({ message: 'OK', data: device });
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// update a product
const updateDevice = asyncHandler(async(req, res) => {
    console.log('updateDevice called');
    try {
        const {id} = req.params;
        const device = await Device.findByIdAndUpdate(id, req.body);
        // we cannot find any product in database
        if(!device){
            res.status(404);
            throw new Error(`cannot find any product with ID ${id}`);
        }
        const updatedDevice = await Device.findById(id);
        res.status(200).json({ message: 'OK', data: updatedDevice });
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const deleteDevice = asyncHandler(async(req, res) =>{
    console.log('deleteDevice called');
    try {
        const { id } = req.params;
        const device = await Device.findByIdAndUpdate(id, { status: 'D' });
        if(!device){
            res.status(404);
            throw new Error(`cannot find any product with ID ${id}`);
        }

        res.status(200).json({ message: 'OK', data: device });
        
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

const sendDeviceCommand = asyncHandler(async(req, res) => {
    console.log('sendDeviceCommand called');
    try {
        const { id } = req.params;
        const { command, payload } = req.body;
        if(!commandClient) {
            res.status(500);
            throw new Error('MQTT not configured');
        }
        const topic = `request/${id}/${command}`;
        commandClient.publish(topic, JSON.stringify(payload || {}));
        res.status(200).json({ message: 'OK' });
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
    deleteDevice,
    sendDeviceCommand,
    setCommandClient
}
