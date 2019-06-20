/* Load Modules */
const express = require('express');
const router = express.Router();

/* Load controller */
const Token = require('../../controller/token');
const token = new Token();

/**
 * Token Entity routes
 */
router.get('/:id', function (req, res) {
  token.findById(req, res);
});
module.exports = router;