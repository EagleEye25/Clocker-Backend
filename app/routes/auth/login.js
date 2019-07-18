/* Load Modules */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config/token');

const Employee = require('../../dao/employeeDao');
const empDao = new Employee();



/**
 * User access control routes
 */


router.post('/', function (req, res) {
  const postData = req.body;
  const userName = typeof postData.name == 'string' ? postData.name : '';
  const userPass = typeof postData.pass == 'string' ? postData.pass : '';
  const cardNum = typeof postData.cardNo == 'string' ? postData.cardNo : '';

  const response = {
    "success": false
  }

  if (cardNum) {
    empDao.findEmployeeByCard(cardNum).then((emp) => {
      if (!emp) {
        throw 'invalid user';
      }

      if (!emp.active) {
        throw 'inactive user';
      }

      if (!(emp.admin || emp.reporting_admin)) {
        throw 'invalid user';
      }

      const user = {
        name: emp.name,
        isAdmin: emp.admin,
        isReportingAdmin: emp.reporting_admin,
        token: 'data'
      }

      const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife});
      user.token = 'refresh';
      const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife});

      response.success = true;
      response.token = token;
      response.refreshToken = refreshToken;
      response.user = user;

      res.status(200).json(response);

    }).catch((err) => {
      return res.status(404).json(response);
    })
  } else {
    empDao.findByName(userName).then((emp) => {
      if (typeof emp === 'string') {
        throw 'invalid user';
      }

      if (emp.password !== userPass) {
        throw 'invalid password';
      }

      if (!emp.active) {
        throw 'inactive user';
      }

      if (!(emp.admin || emp.reporting_admin)) {
        throw 'invalid user';
      }

      const user = {
        name: emp.name,
        isAdmin: emp.admin,
        isReportingAdmin: emp.reporting_admin,
        token: 'data'
      }

      const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife});
      user.token = 'refresh';
      const refreshToken = jwt.sign(user, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife});

      response.success = true;
      response.token = token;
      response.refreshToken = refreshToken;
      response.user = user;

      res.status(200).json(response);

    }).catch( (err) => {
      return res.status(404).json(response);
    })
  }
});

module.exports = router;