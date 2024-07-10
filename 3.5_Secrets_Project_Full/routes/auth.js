const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.status(201).send('User registered');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).send('User not found');
    const validPassword = await user.isValidPassword(password);
    if (!validPassword) return res.status(401).send('Invalid password');

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
