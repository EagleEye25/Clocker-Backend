/* Load Calender Data Access Object */
const CalenderDAO = require('../dao/calenderDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const calender = require('../model/calender');

/**
 * Calender Controller
 */
class Calender {

	constructor() {
		this.dao = new CalenderDAO();
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

module.exports = Calender;