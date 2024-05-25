const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJWT = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied');
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) { return res(401).json({ message: "Invalid Token!" }) };
    req.body.username = verified.username;
    next();
  } catch (err) {
    res.status(400).send('Internal Server Error! \n', err);
  }
};

module.exports = authenticateJWT;
