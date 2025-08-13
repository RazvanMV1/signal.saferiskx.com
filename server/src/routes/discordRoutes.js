// routes/discordRoutes.js
const express = require('express');
const router = express.Router();
const discordController = require('../controllers/discordController');
const auth = require('../middlewares/auth');

console.log('🔗 Loading Discord routes');

// Rută de test (fără autentificare)
router.get('/test', discordController.testDiscordSetup);

// Rute cu autentificare
router.post('/auth/initiate', auth, discordController.initiateDiscordAuth);
router.post('/auth/callback', auth, discordController.handleDiscordCallback);
router.get('/status', auth, discordController.getDiscordStatus);
router.post('/test-enrollment', auth, discordController.testDiscordEnrollment);
router.post('/disconnect', auth, discordController.disconnectDiscord);
router.post('/test-expiration', discordController.testExpiration);

module.exports = router;
