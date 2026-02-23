const mqtt = require('mqtt');
const config = require('./index');

function createMqttClient() {
  return mqtt.connect(config.mqttUrl, {
    username: '',
    password: '',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    will: {
      topic: 'device/will',
      payload: 'device disconnected',
      qos: 0,
      retain: false,
    },
  });
}

function subscribeSensorTopics(client) {
  for (const topic of config.mqttTopics) {
    client.subscribe(topic, (err) => {
      if (err) console.error('MQTT subscribe error:', err);
    });
  }
}

module.exports = { createMqttClient, subscribeSensorTopics };
