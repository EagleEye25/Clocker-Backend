/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const C_Times = require('../../controller/calender_times');
const c_times = new C_Times();

/**
 * Calender_Times Entity routes
 */
router.get('/:id', function (req, res) {
  c_times.findById(req, res);
});

router.get('/', function (req, res) {
  c_times.findAll(res);
});

router.post('/create', function (req, res) {
  c_times.create(req, res);
});

router.put('/:id', function (req, res) {
  c_times.update(req, res);
});

router.delete('/:id', function (req, res) {
  c_times.deleteById(req, res);
});

router.get('/times/unAssigned/:calID', function (req, res) {
  c_times.findUnassigned(req, res);
});

router.get('/times/existing/:c_times', function (req, res) {
  c_times.findExisting(req, res);
});

router.get('/assigned/cal/times/:calID', function (req, res) {
  c_times.findAssignedToCal(req, res);
});

router.put('/unassign/time/:id', function (req, res) {
  c_times.unassignFromCal(req, res);
});
module.exports = router;