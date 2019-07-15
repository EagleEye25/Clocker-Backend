/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const Reports = require('../../controller/reports');
const reports = new Reports();

/**
 * Reason Entity routes
 */
router.get('/getUsersInAndOut', function (req, res) {
  reports.getUsersInAndOut(res);
});

module.exports = router;