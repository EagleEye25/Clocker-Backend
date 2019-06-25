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

router.get('/card_no/:card_no', function (req, res) {
  card.findByCard_No(req, res);
});

router.post('/create', function (req, res) {
  card.create(req, res);
});

router.get('/unlinked/cards', function (req, res) {
  card.findCardsNotLinked(res);
});
module.exports = router;