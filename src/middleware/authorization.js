const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function userCheckToken(req, res) {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: 'ERROR', data: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    return res.json({ message: 'OK', data: decoded });
  } catch (error) {
    return res.status(401).json({ message: 'ERROR', data: 'Token verification failed' });
  }
}

function verifyToken(req, res, next) {
  let token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'ERROR', data: 'No token provided' });
  }

  // Strip Bearer prefix if present
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.User_name = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'ERROR', data: 'Token verification failed' });
  }
}

module.exports = { verifyToken, userCheckToken };
