const express = require('express');
const {
  getMenus,
  getMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} = require('../controllers/menuController');
const { verifyToken } = require("../middleware/authorization");

const router = express.Router();

router.use(verifyToken);

router
  .route('/')
  .get(getMenus)
  .post(createMenu);

router
  .route('/:id')
  .get(getMenu)
  .put(updateMenu)
  .delete(deleteMenu);

module.exports = router;
