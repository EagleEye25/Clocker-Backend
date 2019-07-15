/* Load Calender Data Access Object */
const reportsDao = require('../dao/reportsDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/**
 * Calender Controller
 */
class Reports {

	constructor() {
		this.dao = new reportsDao();
		this.common = new ControllerCommon();
	}

	/**
	 * Tries to find all entities
	 * @params res
	 * @return entity
	 */
	getUsersInAndOut(res) {
		this.dao.getUsersInAndOut()
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

}

module.exports = Reports;