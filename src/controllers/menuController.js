const Menu = require('../models/menuModel');
const asyncHandler = require('express-async-handler');

const getMenus = asyncHandler(async (req, res) => {
  const menus = await Menu.find({ status: 'A' });
  res.json(menus);
});

const getMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (!menu) {
    res.status(404);
    throw new Error(`Menu not found: ${req.params.id}`);
  }
  res.json(menu);
});

const createMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.create(req.body);
  res.status(201).json(menu);
});

const updateMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await Menu.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) {
    res.status(404);
    throw new Error(`Menu not found: ${id}`);
  }
  res.json(updated);
});

const deleteMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const menu = await Menu.findByIdAndUpdate(id, { status: 'D' });
  if (!menu) {
    res.status(404);
    throw new Error(`Menu not found: ${id}`);
  }
  res.json(menu);
});

module.exports = { getMenus, getMenu, createMenu, updateMenu, deleteMenu };
