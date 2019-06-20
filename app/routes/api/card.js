/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const Card = require('../../controller/card');
const card = new Card();

/**
 * Card Entity routes
 */
router.get('/:id', function (req, res) {
  card.findById(req, res);
});
module.exports = router;