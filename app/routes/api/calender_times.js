/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const C_Times = require('../../controller/calender_times');
const c_times = new C_Times();

/**
 * Calender_Times Entity routes
 */
router.get('/:id', function (req, res) {
  c_times.findById(req, res);
});
module.exports = router;