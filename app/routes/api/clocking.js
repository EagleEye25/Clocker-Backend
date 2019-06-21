/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const Clocking = require('../../controller/clocking');
const clocking = new Clocking();

/**
 * Clocking Entity routes
 */
router.get('/', function (req, res) {
  clocking.findAll(res);
});

router.post('/clock_in', function (req, res) {
  clocking.clockIn(req, res);
});

router.put('/clock_out/:id', function (req, res) {
  clocking.clockOut(req, res);
});

router.get('/findEmployee/:employee_id', function (req, res) {
  clocking.findByEmployee(req, res);
});
module.exports = router;