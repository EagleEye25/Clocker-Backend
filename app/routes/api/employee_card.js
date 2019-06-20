/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const E_Card = require('../../controller/employee_card');
const e_card = new E_Card();

/**
 * Employee_Card Entity routes
 */
router.get('/:id', function (req, res) {
  e_card.findById(req, res);
});
module.exports = router;