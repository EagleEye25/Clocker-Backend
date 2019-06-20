/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const Reason = require('../../controller/reason');
const reason = new Reason();

/**
 * Reason Entity routes
 */
router.get('/:id', function (req, res) {
  reason.findById(req, res);
});
module.exports = router;