/* Load Employee_Calender Data Access Object */
const E_CalenderDAO = require('../dao/employee_calender');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const E_Calender = require('../model/employee_calender');

/**
 * Car Controller
 */
class Employee_Calender {

	constructor() {
		this.dao = new E_CalenderDAO();
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

module.exports = Employee_Calender;