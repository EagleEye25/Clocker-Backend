/* Load calender_times Data Access Object */
const c_timesDAO = require('../dao/calender_times');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const calender_times = require('../model/calender_times');

/**
 * Car Controller
 */
class Calender_Times {

	constructor() {
		this.dao = new c_timesDAO();
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

module.exports = Calender_Times;