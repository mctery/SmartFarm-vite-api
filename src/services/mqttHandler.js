const SensorData = require('../models/sensorDataModel');

async function handleSensorMessage(topic, message) {
  try {
    const payload = JSON.parse(message.toString());
    const [, , sensorType] = topic.split('/');

    // Payload format: { addr, device_id, v: { sensorId: value } }
    if (!payload.device_id || !payload.v) return;

    const docs = [];
    for (const [sensorId, value] of Object.entries(payload.v)) {
      docs.push({
        device_id: payload.device_id,
        sensor_id: sensorId,
        sensor: sensorType,
        value: String(value),
      });
    }

    if (docs.length > 0) {
      await SensorData.insertMany(docs);
    }
  } catch (err) {
    console.error('MQTT message handler error:', err.message);
  }
}

module.exports = { handleSensorMessage };
