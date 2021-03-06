/* Load Employee_Calender Data Access Object */
const E_CalenderDAO = require('../dao/employee_calenderDao');

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
		if (!req.params.id) {
			return this.common.findError(res);
		}
		let id = req.params.id;

		this.dao.findById(id)
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
	 * Creates the given entity in the database
	 * @params req, res
	 * returns database insertion status
	 */
	create(req, res) {
		let e_cal = new E_Calender();
		if (!req.body) {
			return this.common.findError(res);
		}

		e_cal.employee_id = req.body.employee_id;
		e_cal.calender_id = req.body.calender_id;
		e_cal.active_date = req.body.active_date;

		return this.dao.create(e_cal)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};

	/**
	 * Updates the given entity in the database
	 * @params req, res
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(req, res) {
		let e_cal = new E_Calender();

		e_cal.id = req.body.id;
		e_cal.employee_id = req.body.employee_id;
		e_cal.calender_id = req.body.calender_id;
		e_cal.active_date = req.body.active_date;

		return this.dao.update(e_cal)
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

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params req, res
	 * returns database deletion status
	 */
	deleteByEmpID(req, res) {
		let id = req.params.id;
		this.dao.deleteByEmpID(id)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};
}

module.exports = Employee_Calender;