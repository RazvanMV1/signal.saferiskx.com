const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { loginLimiter } = require('../middlewares/rateLimiter');
const auth = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login',loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/change-password', auth, authController.changePassword);

router.get('/subscription', auth, authController.getSubscription);
router.get('/subscription/check', auth, authController.checkActiveSubscription);

router.get('/me', authController.getMe);
router.get('/activate', authController.activate);

module.exports = router;