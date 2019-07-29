/* Load Modules */
const express = require('express');
const router = express.Router();
const Employee = require('../../dao/employeeDao');
const emp = new Employee();

router.post('/', function (req, res) {
  console.log('here');

  emp.name = req.body.name;
  emp.admin = req.body.admin;
  emp.reporting_admin = req.body.reporting_admin;
  emp.password = req.body.password;
  emp.active = req.body.active;

  console.log(emp);

  return emp.create(emp);
  console.log(t);
});

module.exports = router;