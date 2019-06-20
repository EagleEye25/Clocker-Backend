/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const Employee = require('../../controller/employee');
const employee = new Employee();

/**
 * Employee Entity routes
 */
router.get('/:id', function (req, res) {
  employeeController.findById(req, res);
});
module.exports = router;