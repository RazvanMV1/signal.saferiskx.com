const express = require('express');
const router = express.Router();

// Endpoint simplu de test
router.get('/test', (req, res) => {
  res.json({ message: 'Serverul funcționează!' });
});

module.exports = router;