const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema(
  {
    // user_id: {
    //   type: Number, // or mongoose.Schema.Types.Number
    //   required: true,
    // },
    device_id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
    },
    // online_status: {
    //   type: Boolean,
    //   required: true,
    // },
    // image: {
    //   type: String,
    //   required: false,
    // },
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;




// {
//   "user_id": 123,
//   "device_id": "44c44e9ef0c7",
//   "name": "My Device",
//   "status": true,
//   "online_status": true,
//   "image": "device-image.jpg"
// }