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
  employee.findById(req, res);
});

router.get('/', function (req, res) {
  employee.findAll(res);
});

router.post('/create', function (req, res) {
  employee.create(req, res);
});

router.put('/:id', function (req, res) {
  employee.update(req, res);
});

router.delete('/:id', function (req, res) {
  employee.deleteById(req, res);
});

router.get('/unassigned/employees', function (req, res) {
  employee.findUnassingnedEmployees(res);
});

router.get('/findByName/:name', function (req, res) {
  employee.findByName(req, res);
});

router.get('/unassigned/employees/calender', function (req, res) {
  employee.findUnassignedEmpToCal(res);
});

router.put('/delete/:id', function (req, res) {
  employee.delete(req, res);
});

router.get('/assigned/cal/employees/:calID', function (req, res) {
  employee.findAssignedToCal(req, res);
});

router.get('/unassigned/employees/calendars/:calID', function (req, res) {
  employee.findUnassignedTOCal(req, res);
});

module.exports = router;