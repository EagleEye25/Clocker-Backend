/**
 * Express Router configuration
 */
const express = require('express');
const router = express.Router();

/* API routes */
router.use('/calender_times', require('./api/calender_times'));
router.use('/calender', require('./api/calender'));
router.use('/card', require('./api/card'));
router.use('/clocking', require('./api/clocking'));
router.use('/employee_calender', require('./api/employee_calender'));
router.use('/employee_card', require('./api/employee_card'));
router.use('/employee', require('./api/employee'));
router.use('/reason', require('./api/reason'));
router.use('/token', require('./api/token'));
router.use('/reports', require('./api/reports'));

module.exports = router;