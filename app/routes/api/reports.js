/* Load Modules */
const express = require("express");
const router = express.Router();

/* Load controller */
const Reports = require("../../controller/reports");
const reports = new Reports();

/**
 * Reason Entity routes
 */
router.get("/getUsersInAndOut", function(req, res) {
  reports.getUsersInAndOut(res);
});

router.post("/reports", function(req, res) {
  let inTime = +(req.body.start || 0);
  let outTime = +(req.body.end || 0);

  // @TODO: return error if passed in filters are invalid
  if (!inTime || inTime < 0) {
    inTime = 0;
  }
  if (!outTime || outTime <= inTime) {
    outTime = Number.MAX_SAFE_INTEGER;
  }
  let employees = req.body.employees || [];
  if (Object.prototype.toString.call(employees) !== "[object Array]") {
    employees = [];
  }
  employees = employees.filter(
    e => typeof e === "number" && e > 0 && e < Number.MAX_SAFE_INTEGER
  );

  // Pass params to handler and return appropriate result
  reports
    .allReports(employees, inTime, outTime)
    .then(result => {
      return res.status(200).json(result);
    })
    .catch(() => {
      return res.status(404);
    });
});

module.exports = router;
