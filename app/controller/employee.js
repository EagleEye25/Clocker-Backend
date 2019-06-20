/* Load Car Data Access Object */
const EmployeeDao = require('../dao/employee');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const employee = require('../model/employee');

/**
 * Car Controller
 */
class Employee {

	constructor() {
		this.dao = new EmployeeDao();
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

module.exports = Employee;