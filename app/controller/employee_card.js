/* Load Employee_Card Data Access Object */
const E_CardDAO = require('../dao/employee_cardDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const E_Card = require('../model/employee_card');

/**
 * Car Controller
 */
class Employee_Card {

	constructor() {
		this.dao = new E_CardDAO();
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

module.exports = Employee_Card;