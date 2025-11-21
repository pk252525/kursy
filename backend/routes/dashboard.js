// routes/dashboard.js
const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  res.json({ message: `Witaj ${req.user.email}, to jest Twój dashboard!` });
});

module.exports = router;
