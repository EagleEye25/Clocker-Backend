/* Load Modules */
const express = require('express');
const router = express.Router();
const Reasons = require('../../dao/reasonDao');
const reasons = new Reasons();

router.get('/', function (req, res) {
  return reasons.findAll().then((found) => {
    if (!found) {
      return res.status(200).json({"found": false});
    } else {
      return res.status(200).json({found});
    }
  });
});


module.exports = router;