const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const config = require('./config');
const { createMqttClient, subscribeSensorTopics } = require('./config/mqtt');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());

// MQTT → Socket.IO bridge
const mqttClient = createMqttClient();

mqttClient.on('connect', () => {
  console.log('Socket.IO MQTT client connected');
  subscribeSensorTopics(mqttClient);
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('Socket.IO client disconnected');
  });
});

mqttClient.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    if (!payload.device_id) return;

    const sensorType = topic.split('/')[2];
    io.emit(`${sensorType}Data`, payload);
  } catch (error) {
    console.error('Socket MQTT message error:', error.message);
  }
});

server.listen(config.socketPort, () => {
  console.log(`Socket.IO server running on port ${config.socketPort}`);
});

module.exports = app;
