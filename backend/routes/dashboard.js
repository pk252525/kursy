// routes/dashboard.js
const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

/**
 * Chroniona trasa dashboardu
 * Wymaga poprawnego tokena JWT w nagłówku:
 * Authorization: Bearer <token>
 */
router.get('/', authenticateToken, (req, res) => {
  res.json({
    message: `Witaj ${req.user.email}, to jest Twój dashboard!`,
    user: req.user, // możesz zwrócić więcej danych o użytkowniku
    time: new Date().toISOString()
  });
});

module.exports = router;
