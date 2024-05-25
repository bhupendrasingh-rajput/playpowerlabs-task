const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const User = require('../Models/user');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) { return res.status(400).json({ message: "Bad Request!" }) };

    const user = await User.findOne({ where: { username } });

    if (!user) return res.status(400).json({ message: 'Invalid Username!' });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.status(400).json({ message: 'Invalid Password!' });

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);

    res.json({ message: "User Logged in Successfully!", token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) { return res.status(400).json({ message: "Bad Request!" }) };

    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) return res.status(400).json({ message: 'User Already Exists!' });

    const user = await User.create({ username, password, role });

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);

    res.status(201).json({ message: 'User registered successfully!', token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { login, register };
