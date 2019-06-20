/* Load Reason Data Access Object */
const ReasonDAO = require('../dao/reasonDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const reason = require('../model/reason');

/**
 * Car Controller
 */
class Reason {

	constructor() {
		this.dao = new ReasonDAO();
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

module.exports = Reason;