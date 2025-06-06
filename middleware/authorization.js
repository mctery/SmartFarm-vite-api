const jwt = require("jsonwebtoken");

async function userCheckToken(req, res) {
  try {
    let { token } = req.body;
    if (token) {
      const TOKEN_KEY = process.env.TOKEN_KEY;
      jwt.verify(token, TOKEN_KEY, async (error, decodedToken) => {
        if (error) {
          return res.status(200).json({ message: "ERROR", data: error });
        }
        return res.status(200).json({ message: "OK", data: decodedToken });
      });
    } else {
      return res.status(200).json({ message: "ERROR", data: "No token provided" });
    }
  } catch (error) {
    res.status(500).json({ message: "ERROR", data: error.message });
  }
}

async function verifyToken(req, res, next) {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(200).json({ message: "ERROR", data: "No token provided" });
    }
    const TOKEN_KEY = process.env.TOKEN_KEY;
    jwt.verify(token, TOKEN_KEY, async (error, decodedToken) => {
      if (error) {
        return res.status(200).json({ message: "ERROR", data: "Token verification failed" });
      }
      req.User_name = decodedToken;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "ERROR", data: error.message });
  }
}

module.exports = { verifyToken, userCheckToken };
