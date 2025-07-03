const mongoose = require('mongoose');

const menuSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    order: { type: Number, default: 0 },
    status: { type: String, required: true, default: 'A' },
  },
  {
    timestamps: true,
  }
);

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
