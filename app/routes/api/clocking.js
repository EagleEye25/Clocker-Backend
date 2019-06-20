/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const Clocking = require('../../controller/clocking');
const clocking = new Clocking();

/**
 * Clocking Entity routes
 */
router.get('/:id', function (req, res) {
  clocking.findById(req, res);
});
module.exports = router;