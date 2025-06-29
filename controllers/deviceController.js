const Device = require('../models/deviceModel');
const SensorWidget = require('../models/sensorWidgetModel');
const asyncHandler = require('express-async-handler');
const mqtt = require('mqtt');

let commandClient;
if (process.env.MQTT_URL && process.env.NODE_ENV !== 'test') {
    commandClient = mqtt.connect(process.env.MQTT_URL);
}
function setCommandClient(client) {
    commandClient = client;
}

// GET all active devices
const getDevices = asyncHandler(async (req, res) => {
    console.log('getDevices called');
    try {
        const devices = await Device.find({ status: 'A' });
        res.status(200).json({ message: 'OK', data: devices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET single device by MongoDB _id
const getDevice = asyncHandler(async (req, res) => {
    console.log('getDevice called');
    try {
        const { id } = req.params;
        const device = await Device.findById(id);
        if (!device) {
            res.status(404).json({ message: `Device not found with _id: ${id}` });
            return;
        }
        res.status(200).json({ message: 'OK', data: device });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET all devices by user_id
const getDeviceUser = asyncHandler(async (req, res) => {
    console.log('getDeviceUser called');
    try {
        const { user_id } = req.params;
        const device = await Device.find({ user_id, status: 'A' });
        res.status(200).json({ message: 'OK', data: device });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE new device
const createDevice = asyncHandler(async (req, res) => {
    console.log('createDevice called');
    try {
        req.body.status = 'A';

        // Check for duplicate device_id when function available
        if (typeof Device.findOne === 'function') {
            const exists = await Device.findOne({ device_id: req.body.device_id });
            if (exists) {
                return res.status(400).json({ message: 'device_id already exists' });
            }
        }

        const device = await Device.create(req.body);
        await SensorWidget.create({ device_id: req.body.device_id });

        res.status(200).json({ message: 'OK', data: device });
    } catch (error) {
        console.error("Create device error:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// UPDATE device by device_id
const updateDevice = asyncHandler(async (req, res) => {
    console.log('updateDevice called');
    try {
        const { id } = req.params;
        console.log("Updating device with device_id:", id);

        const updateData = { ...req.body };

        // Normalize types
        if (typeof updateData.status === 'boolean') {
            updateData.status = updateData.status ? 'A' : 'D';
        }
        if (typeof updateData.user_id === 'number') {
            updateData.user_id = updateData.user_id.toString();
        }

        const updatedDevice = await Device.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedDevice) {
            res.status(404).json({ message: `Cannot find any device with device_id ${id}` });
            return;
        }

        res.status(200).json({ message: 'OK', data: updatedDevice });

    } catch (error) {
        console.error("Update device error:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// DELETE (soft delete) device by device_id
const deleteDevice = asyncHandler(async (req, res) => {
    console.log('deleteDevice called');
    try {
        const { id } = req.params;
        const device = await Device.findByIdAndUpdate(
            id,
            { status: 'D' },
            { new: true }
        );

        if (!device) {
            res.status(404).json({ message: `Cannot find any device with device_id ${id}` });
            return;
        }

        res.status(200).json({ message: 'OK', data: device });

    } catch (error) {
        console.error("Delete device error:", error.message);
        res.status(500).json({ message: error.message });
    }
});

// Send MQTT command to device
const sendDeviceCommand = asyncHandler(async (req, res) => {
    console.log('sendDeviceCommand called');
    try {
        const { id } = req.params;
        const { command, payload } = req.body;

        if (!commandClient) {
            return res.status(500).json({ message: 'MQTT not configured' });
        }

        const topic = `request/${id}/${command}`;
        commandClient.publish(topic, JSON.stringify(payload || {}));

        res.status(200).json({ message: 'OK' });
    } catch (error) {
        console.error("MQTT error:", error.message);
        res.status(500).json({ message: error.message });
    }
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
