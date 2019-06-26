/* Load Employee Data Access Object */
const EmployeeDao = require('../dao/employeeDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const employee = require('../model/employee');

/**
 * Employee Controller
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
		if (!req.params.id) {
			return this.common.findError(res);
		}
		let id = req.params.id;

		this.dao.findById(id)
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params req, res
	 * @return entity
	 */
	findByName(req, res) {
		let name = req.params.name;

		this.dao.findByName(name)
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

	/**
	 * Tries to find all entities
	 * @params res
	 * @return entity
	 */
	findAll(res) {
		this.dao.findAll()
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

	/**
	 * Tries to find all entities
	 * @params res
	 * @return entity
	 */
	findUnassingnedEmployees(res) {
		this.dao.findUnassingnedEmployees()
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

	/**
	 * Creates the given entity in the database
	 * @params req, res
	 * returns database insertion status
	 */
	create(req, res) {
		let emp = new employee();
		if (!req.body) {
			return this.common.findError(res);
		}

		emp.name = req.body.name;
		emp.admin = req.body.admin;
		emp.reporting_admin = req.body.reporting_admin;
		emp.password = req.body.password;
		emp.calender_id = req.body.calender_id;

		return this.dao.create(emp)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};

	/**
	 * Updates the given entity in the database
	 * @params req, res
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(req, res) {
		let emp = new employee();

		emp.id = req.body.id;
		emp.name = req.body.name;
		emp.admin = req.body.admin;
		emp.reporting_admin = req.body.reporting_admin;
		emp.password = req.body.password;
		emp.calender_id = req.body.calender_id;

		return this.dao.update(emp)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params req, res
	 * returns database deletion status
	 */
	deleteById(req, res) {
		let id = req.params.id;

		this.dao.deleteById(id)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};
}

module.exports = Employee;