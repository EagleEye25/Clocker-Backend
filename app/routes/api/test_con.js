/* Load Modules */
const express = require('express');
const router = express.Router();
const Employee = require('../../dao/employeeDao');
const emp = new Employee();

router.get('/', function (req, res) {
  return res.status(200).json({})
});

module.exports = router;