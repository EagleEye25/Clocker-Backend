/**
 * Express Router configuration
 */
const express = require('express');
const router = express.Router();

/* API routes */
router.use('/login', require('./auth/login'));

router.use('/clocking', require('./api/clocking'));
router.use('/test', require('./api/test_con'));

router.use('/callAdd', require('./api/call_add'));
router.use('/openReasons', require('./api/open_reasons'));


module.exports = router;