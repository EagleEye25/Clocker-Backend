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

router.get('/', function (req, res) {
  e_calender.findAll(res);
});

router.post('/create', function (req, res) {
  e_calender.create(req, res);
});

router.put('/:id', function (req, res) {
  e_calender.update(req, res);
});

router.delete('/:id', function (req, res) {
  e_calender.deleteById(req, res);
});
module.exports = router;