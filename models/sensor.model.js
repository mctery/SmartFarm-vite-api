const mongoose = require("mongoose");
const moment = require("moment"); // Import moment

const currentTime = moment().format("YYYY/MM/DD HH:mm:ss"); // รับวันที่และเวลาปัจจุบันด้วย moment

const sensorSchema = mongoose.Schema(
  {
    user_id: {
      type: Number, // or mongoose.Schema.Types.Number
      required: false,
    },
    device_id: {
      type: String,
      required: true,
    },
    sensor_type: {
      type: String,
      required: true,
    },
    sensor_id: {
      type: String,
      require: false,
    },
    version: {
      type: String,
      require: false,
    },
    unit: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      required: false,
    },
    time: {
      type: String,
      required: true,
      default: currentTime, // ให้ค่าเริ่มต้นเป็นค่า currentTime
    },
    updated_at: {
      type: Date,
      required: true,
      default: currentTime, // เพิ่มการอัปเดตค่าเมื่อมีการเปลี่ยนแปลง
    },
  },
  {
    timestamps: true,
  }
);

const Sensor = mongoose.model("Sensor", sensorSchema);

module.exports = Sensor;

// const mongoose = require('mongoose');

// const sensorSchema = mongoose.Schema(
//   {
//     user_id: {
//       type: Number, // or mongoose.Schema.Types.Number
//       required: true,
//     },
//     device_id: {
//       type: String,
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: Boolean,
//       required: true,
//     },
//     online_status: {
//       type: Boolean,
//       required: true,
//     },
//     image: {
//       type: String,
//       required: false,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Sensor = mongoose.model('Sensor', sensorSchema);

// module.exports = Sensor;

// {
//   "user_id": 123,
//   "device_id": "44c44e9ef0c7",
//   "name": "My Device",
//   "status": true,
//   "online_status": true,
//   "image": "device-image.jpg"
// }
