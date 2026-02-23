const mongoose = require('mongoose');

const sensorSchema = mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: false,
    },
    device_id: {
      type: String,
      required: true,
    },
    sensor_name: {
      type: String,
      required: false,
    },
    sensor_type: {
      type: String,
      required: true,
    },
    sensor_id: {
      type: String,
      required: false,
    },
    unit: {
      type: String,
      required: false,
    },
    bgcolor: {
      type: String,
      required: false,
      default: '#ecf0f1',
    },
    status: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;
