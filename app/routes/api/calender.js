/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const Calender = require('../../controller/calender');
const calender = new Calender();

/**
 * Calender Entity routes
 */
router.get('/:id', function (req, res) {
  calender.findById(req, res);
});
module.exports = router;