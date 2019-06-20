/* Load Token Data Access Object */
const TokenDAO = require('../dao/tokenDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const token = require('../model/token');

/**
 * Car Controller
 */
class Token {

	constructor() {
		this.dao = new TokenDAO();
		this.common = new ControllerCommon();
	}

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params req, res
	 * @return entity
	 */
	findById(req, res) {
		let id = req.params.id;

		this.dao.findById(id)
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};
}

module.exports = Token;