/* Load Modules */
const express = require('express');
const router = express.Router();
const Employee = require('../../dao/employeeDao');
const emp = new Employee();

router.post('/', function (req, res) {

  emp.name = req.body.name;
  emp.admin = req.body.admin;
  emp.reporting_admin = req.body.reporting_admin;
  emp.password = req.body.password;
  emp.active = req.body.active;

  return emp.create(emp);
});

router.get('/Admin', function (req, res) {
  return emp.findAdmin().then((found) => {
    if (!found) {
      return res.status(200).json({"found": false});
    } else {
      return res.status(200).json({"found": true});
    }
  });
});


module.exports = router;