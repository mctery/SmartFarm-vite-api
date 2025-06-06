const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
var mqtt = require("mqtt");

const MQTT_URL = process.env.MQTT_URL;

const mqttClient = mqtt.connect(MQTT_URL, {
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

const subscribeTopics = ["device/+/notify", "device/+/checkin", "device/+/will"];

mqttClient.on("connect", function () {
  console.log("mqtt client connected");
  for (let index = 0; index < subscribeTopics.length; index++) {
    const topic = subscribeTopics[index];
    // console.log('subscribe: ', topic)
    mqttClient.subscribe(topic, function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
});

mqttClient.on("message", async function (topic, message) {
  // message is Buffer
  try {
    console.log(message.toString());
    // console.log(topic.toString())
    let payload = JSON.parse(message.toString());
    if (payload.device_id) {
      // flutter/906629f7c630/notify
      // flutter/906629f7c630/checkin
      // flutter/906629f7c630/will
      // [flutter, 906629f7c630, will]

      const topicParts = topic.split("/");
      if (topicParts[2] === "checkin") {
        console.log("online: ", payload);
        // DeviceService.updateOnline(payload)
      }
      if (topicParts[2] === "will") {
        console.log("offline: ", payload);
        // DeviceService.updateOffline(payload)
      }
      if (topicParts[2] === "notify") {
        //  DeviceDataService.createOrUpdate(payload)
      }
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = app;

// ค่าที่ต้องส่งไป topic =  request/44c44e9ef0c8/timeinput
// {"id" :5 , "check_on" : "8" , "index_timeinput" : 0 , "day" : 12 , "schedule_hour_on" : 15 , "schedule_min_on" : 51 ,  "schedule_hour_off" : 15 , "schedule_min_off" : 52}
