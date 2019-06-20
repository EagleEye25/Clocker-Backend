/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const E_Calender = require('../../controller/employee_calender');
const e_calender = new E_Calender();

/**
 * Employee_Calender Entity routes
 */
router.get('/:id', function (req, res) {
  e_calender.findById(req, res);
});
module.exports = router;