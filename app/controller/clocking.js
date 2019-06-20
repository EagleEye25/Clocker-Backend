/* Load Clocking Data Access Object */
const ClockingDAO = require('../dao/clockingDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const clocking = require('../model/clocking');

/**
 * Car Controller
 */
class Clocking {

	constructor() {
		this.dao = new ClockingDAO();
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

module.exports = Clocking;