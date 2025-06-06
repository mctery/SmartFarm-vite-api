const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const app = express();

const http = require("http"); // Import the http module before using it
const server = http.createServer(app);
const io = socketIo(server);

const port = 3200;

require("dotenv").config();
var mqtt = require("mqtt");

const MQTT_URL = process.env.MQTT_URL;

var client = mqtt.connect(MQTT_URL, {
  username: "",
  password: "",
  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
  will: {
    topic: "device/will",
    payload: "device disconnected",
    qos: 0,
    retain: false,
  },
});

app.use(cors());
app.use(express.json());

let topics = [
  "device/+/temperature",
  "device/+/humidity",
  "device/+/light",
  "device/+/soil",
];

client.on("connect", function () {
  console.log("mqtt client connected");
  for (let index = 0; index < topics.length; index++) {
    const topic = topics[index];
    client.subscribe(topic, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
});

io.on("connection", (socket) => {
  // เมื่อผู้ใช้ตัดการเชื่อมต่อ
  socket.on("disconnect", () => {
    console.log("ผู้ใช้ตัดการเชื่อมต่อกับเซิร์ฟเวอร์ Socket.IO");
  });
});

client.on("message", async function (topic, message) {
  // message is Buffer
  try {
    let payload = JSON.parse(message.toString());
    if (payload.device_id) {
      let topics = topic.split("/");
      if (topics[2] === "temperature") {
        io.emit("temperatureData", payload);
      }
      if (topics[2] === "humidity") {
        io.emit("humidityData", payload);
      }
      if (topics[2] === "light") {
        io.emit("lightData", payload);
      }
      if (topics[2] === "soil") {
        io.emit("soilData", payload);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

server.listen(port, () => {
  console.log(`เซิร์ฟเวอร์ Socket.IO กำลังทำงานบนพอร์ต ${port}`);
});

module.exports = app;

// ค่าที่ต้องส่งไป topic =  request/44c44e9ef0c8/timeinput
// {"id" :5 , "check_on" : "8" , "index_timeinput" : 0 , "day" : 12 , "schedule_hour_on" : 15 , "schedule_min_on" : 51 ,  "schedule_hour_off" : 15 , "schedule_min_off" : 52}
