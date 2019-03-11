/* Load Car Data Access Object */
const EmployeeDao = require('../dao/employeeDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const Employee = require('../model/employee');

/**
 * Car Controller
 */
class EmployeeController {

	constructor() {
		this.employeeDao = new EmployeeDao();
		this.common = new ControllerCommon();
	}

	 /**
     * Tries to find an entity using its Id / Primary Key
     * @params req, res
     * @return entity
     */
    findById(req, res) {
			let id = req.params.id;

			this.employeeDao.findById(id)
					.then(this.common.findSuccess(res))
					.catch(this.common.findError(res));
	};
}

module.exports = EmployeeController;