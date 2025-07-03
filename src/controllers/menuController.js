const Menu = require('../models/menuModel');
const asyncHandler = require('express-async-handler');

const getMenus = asyncHandler(async (req, res) => {
  const menus = await Menu.find({ status: 'A' });
  res.status(200).json(menus);
});

const getMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  if (!menu) {
    res.status(404);
    throw new Error(`cannot find ID ${req.params.id}`);
  }
  res.status(200).json(menu);
});

const createMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.create(req.body);
  res.status(200).json(menu);
});

const updateMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const menu = await Menu.findByIdAndUpdate(id, req.body);
  if (!menu) {
    res.status(404);
    throw new Error(`cannot find ID ${id}`);
  }
  const updated = await Menu.findById(id);
  res.status(200).json(updated);
});

const deleteMenu = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const menu = await Menu.findByIdAndUpdate(id, { status: 'D' });
  if (!menu) {
    res.status(404);
    throw new Error(`cannot find ID ${id}`);
  }
  res.status(200).json(menu);
});

module.exports = { getMenus, getMenu, createMenu, updateMenu, deleteMenu };
