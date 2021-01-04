const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const setting = require('../controllers/setting');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/logout', authController.logout_get);
router.post('/setting', setting.shiftSetting);

module.exports = router;