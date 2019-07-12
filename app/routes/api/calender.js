/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const Calender = require('../../controller/calender');
const calender = new Calender();

/**
 * Calender Entity routes
 */
router.get('/:id', function (req, res) {
  calender.findById(req, res);
});

router.get('/', function (req, res) {
  calender.findAll(res);
});

router.post('/create', function (req, res) {
  calender.create(req, res);
});

router.put('/:id', function (req, res) {
  calender.update(req, res);
});

router.delete('/:cal_id', function (req, res) {
  calender.deleteById(req, res);
});

router.get('/unassigned/calender', function (req, res) {
  calender.findUnassigned(res);
});

router.get('/assigned/calender', function (req, res) {
  calender.findAssigned(res);
});


router.get('/findByName/:name', function (req, res) {
  calender.findByName(req, res);
});

module.exports = router;