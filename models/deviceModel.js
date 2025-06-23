const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema(
  {
    device_id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: '',
    },
    online_status: {
      type: Boolean,
      required: false,
      default: false,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;

// {
//   "user_id": 123,
//   "device_id": "44c44e9ef0c7",
//   "name": "My Device",
//   "status": true,
//   "online_status": true,
//   "image": "device-image.jpg"
// }
