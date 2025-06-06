const mongoose = require('mongoose');

const sensorWidgetSchema = new mongoose.Schema(
    {
        device_id: {
            type: String,
            required: true,
        },
        widget_json: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            required: true,
            default: 'A',
        },
    },
    {
        timestamps: true,
    }
);

const SensorWidget = mongoose.model('SensorWidget', sensorWidgetSchema);

module.exports = SensorWidget;
