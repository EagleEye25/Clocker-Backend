/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const Reason = require('../../controller/reason');
const reason = new Reason();

/**
 * Reason Entity routes
 */
router.get('/:id', function (req, res) {
  reason.findById(req, res);
});

router.get('/', function (req, res) {
  reason.findAll(res);
});

router.post('/create', function (req, res) {
  reason.create(req, res);
});

router.put('/:id', function (req, res) {
  reason.update(req, res);
});

router.delete('/:id', function (req, res) {
  reason.deleteById(req, res);
});
module.exports = router;