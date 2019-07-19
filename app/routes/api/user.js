const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config/token');

const Employee = require('../../dao/employeeDao');
const empDao = new Employee();

router.post('/refreshToken', function (req, res) {
    const postData = req.body;
    const response = {
      "success": false
    }
    const token = postData.token;
    if (token) {
			// verifies secret and checks exp
			jwt.verify(token, config.refreshTokenSecret, function(err, decoded) {
				if (err) {
					return res.status(404).json(response);
				}
				if (decoded.token !== 'refresh') {
					return res.status(404).json(response);
				}
				const userName = decoded.name;
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
					const user = {
							name: emp.name,
							isAdmin: emp.admin,
							isReportingAdmin: emp.reporting_admin
					}

					const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife});

					response.success = true;
					response.token = token;
					response.user = user;

					res.status(200).json(response);

				}).catch( (err) => {
					return res.status(404).json(response);
				})
			});
		} else {
			return res.status(404).json(response);
		}
  });

  module.exports = router;