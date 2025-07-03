const express = require('express');
const {
  login,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUser,
} = require('../controllers/userController');
const { userCheckToken, verifyToken } = require('../middleware/authorization');

const router = express.Router();

router.use((req, res, next) => {
  const openPaths = ['/login', '/register', '/token'];
  if (openPaths.includes(req.path)) return next();
  verifyToken(req, res, next);
});

router.post('/login', login);
router.post('/token', userCheckToken);

router.route('/register').post(createUser);

router.route('/')
  .get(getUsers);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
