/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const EmployeeController = require('../../controller/employeeController');
const employeeController = new EmployeeController();

/**
 * Employee Entity routes
 */
router.get('/:id', function (req, res) {
  employeeController.findById(req, res);
});
module.exports = router;