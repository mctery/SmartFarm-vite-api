const SensorData = require('../models/sensorDataModel');
const Device = require('../models/deviceModel');
const DeviceLog = require('../models/deviceLogModel');
const SensorThreshold = require('../models/sensorThresholdModel');
const Notification = require('../models/notificationModel');
const logger = require('../config/logger');
const { SENSOR_VALUE_RANGE } = require('../config');
const { emitToDevice } = require('../config/socketio');

/**
 * Handle sensor data messages (device/{id}/temperature, humidity, light, soil)
 * - Save sensor data to DB
 * - Update device online_status + last_seen
 */
async function handleSensorMessage(topic, message) {
  try {
    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch {
      logger.warn('MQTT invalid JSON payload', { topic });
      return;
    }

    const [, , sensorType] = topic.split('/');

    // Validate required fields
    if (!payload.device_id || typeof payload.device_id !== 'string') {
      logger.warn('MQTT missing or invalid device_id', { topic });
      return;
    }
    if (!payload.v || typeof payload.v !== 'object') {
      logger.warn('MQTT missing or invalid v (values)', { topic, device_id: payload.device_id });
      return;
    }

    const docs = [];
    for (const [sensorId, value] of Object.entries(payload.v)) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        logger.warn('MQTT non-numeric sensor value', { topic, sensorId, value });
        continue;
      }
      if (numValue < SENSOR_VALUE_RANGE.min || numValue > SENSOR_VALUE_RANGE.max) {
        logger.warn('MQTT sensor value out of range', { topic, sensorId, value: numValue });
        continue;
      }
      docs.push({
        device_id: payload.device_id,
        sensor_id: sensorId,
        sensor: sensorType,
        value: numValue,
      });
    }

    if (docs.length > 0) {
      await SensorData.insertMany(docs);
    }

    // Update device online status + last_seen
    await Device.findOneAndUpdate(
      { device_id: payload.device_id },
      { online_status: true, last_seen: new Date() }
    );

    // Emit to Socket.IO clients (same event name as MQTT topic)
    emitToDevice(payload.device_id, `device/${payload.device_id}/${sensorType}`, {
      device_id: payload.device_id,
      v: payload.v,
    });

    // Check thresholds and create notifications
    await checkThresholds(payload.device_id, docs);
  } catch (err) {
    logger.error('MQTT message handler error', { error: err.message });
  }
}

/**
 * Check sensor values against thresholds and create notifications if exceeded.
 */
async function checkThresholds(deviceId, sensorDocs) {
  try {
    const thresholds = await SensorThreshold.find({
      device_id: deviceId,
      is_active: true,
    });

    if (thresholds.length === 0) return;

    const device = await Device.findOne({ device_id: deviceId });
    if (!device) return;

    for (const doc of sensorDocs) {
      const numValue = doc.value;

      const threshold = thresholds.find((t) => t.sensor_id === doc.sensor_id);
      if (!threshold) continue;

      let alertTitle = null;
      let severity = 'warning';

      if (threshold.min_value !== null && numValue < threshold.min_value) {
        alertTitle = `${doc.sensor} ต่ำกว่าเกณฑ์: ${numValue} (min: ${threshold.min_value})`;
      } else if (threshold.max_value !== null && numValue > threshold.max_value) {
        alertTitle = `${doc.sensor} เกินเกณฑ์: ${numValue} (max: ${threshold.max_value})`;
        severity = 'critical';
      }

      if (alertTitle) {
        await Notification.create({
          user_id: device.user_id,
          device_id: deviceId,
          sensor_id: doc.sensor_id,
          type: 'threshold_alert',
          title: alertTitle,
          message: `Device: ${device.name} | Sensor: ${doc.sensor_id} | Value: ${numValue}`,
          severity,
        });
        logger.info('Threshold alert created', { device_id: deviceId, sensor_id: doc.sensor_id, value: numValue });
      }
    }
  } catch (err) {
    logger.error('Threshold check error', { error: err.message });
  }
}

/**
 * Handle device checkin messages (device/{id}/checkin)
 * - Mark device online + update last_seen
 * - Log online event
 */
async function handleDeviceCheckin(topic, message) {
  try {
    const parts = topic.split('/');
    const deviceId = parts[1];

    let metadata = {};
    try {
      const payload = JSON.parse(message.toString());
      metadata = payload.addr ? { rssi: payload.addr.rssi } : {};
    } catch {
      // payload may not be JSON
    }

    await Device.findOneAndUpdate(
      { device_id: deviceId },
      { online_status: true, last_seen: new Date() }
    );

    await DeviceLog.create({
      device_id: deviceId,
      event: 'online',
      metadata,
    });

    // Emit to Socket.IO clients
    emitToDevice(deviceId, `device/${deviceId}/checkin`, {
      device_id: deviceId,
      addr: metadata.rssi !== undefined ? { rssi: metadata.rssi } : undefined,
    });

    logger.debug('Device checkin', { device_id: deviceId });
  } catch (err) {
    logger.error('Device checkin handler error', { error: err.message });
  }
}

/**
 * Handle device will/disconnect messages (device/{id}/will)
 * - Mark device offline
 * - Log offline event
 */
async function handleDeviceWill(topic, _message) {
  try {
    const parts = topic.split('/');
    const deviceId = parts[1];

    const device = await Device.findOneAndUpdate(
      { device_id: deviceId },
      { online_status: false },
      { new: true }
    );

    await DeviceLog.create({
      device_id: deviceId,
      event: 'offline',
      metadata: {},
    });

    // Emit to Socket.IO clients
    emitToDevice(deviceId, `device/${deviceId}/will`, { device_id: deviceId });

    // Create offline notification
    if (device) {
      await Notification.create({
        user_id: device.user_id,
        device_id: deviceId,
        type: 'device_offline',
        title: `${device.name} ออฟไลน์`,
        message: `อุปกรณ์ ${device.name} (${deviceId}) หยุดเชื่อมต่อ`,
        severity: 'warning',
      });
    }

    logger.debug('Device will (offline)', { device_id: deviceId });
  } catch (err) {
    logger.error('Device will handler error', { error: err.message });
  }
}

module.exports = { handleSensorMessage, handleDeviceCheckin, handleDeviceWill };
