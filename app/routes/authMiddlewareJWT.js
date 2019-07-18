const jwt = require('jsonwebtoken');
const config = require('../config/token');

module.exports = function(req,res,next) {
	const token = req.body.token || req.query.token || req.headers['x-access-token']
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.secret, function(err, decoded) {
			console.log('@@@@@ authJWT decoded: ', decoded);
			if (err) {
				return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
			}
			if (!decoded.token || decoded.token !== 'data') {
				return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
			}
			req.decoded = decoded;
			next();
		});
	} else {
		return res.status(403).send({
			"error": true,
			"message": 'No token provided.'
		});
	}
};