/**
 * Express Router configuration
 */
const express = require('express');
const router = express.Router();

/* API routes */
router.use('/employee', require('./api/employeeRoutes'));

module.exports = router;