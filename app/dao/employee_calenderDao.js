/* Load employee_calender entity */
const employee_calender = require('../model/employee_calender');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Calender Data Access Object
 */
class Employee_Calender {

	constructor() {
		this.common = new daoCommon();
	}

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params id
	 * @return entity
	 */
	async findById(id) {
		let sqlRequest = "SELECT * FROM employee_calender WHERE id=$id";
		let sqlParams = {$id: id};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		return new employee_calender(row.id, row.employee_id, row.calender_id, row.active_date);
	};

	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findAll() {
		let sqlRequest = "SELECT * FROM employee_calender";
		const rows = await this.common.findAll(sqlRequest);
		let emp_calenders = [];
		for (const row of rows) {
			emp_calenders.push(new employee_calender(row.id, row.employee_id, row.calender_id, row.active_date));
		}
		return emp_calenders;
	};

	/**
	 * Creates the given entity in the database
	 * @params employee_calender
	 * returns database insertion status
	 */
	create(employee_calender) {
		let sqlRequest = `INSERT into employee_calender (employee_id, calender_id, active_date)
				VALUES ($employee_id, $calender_id, $active_date)`;

		let sqlParams = {
			$employee_id: employee_calender.employee_id,
			$calender_id: employee_calender.calender_id,
			$active_date: employee_calender.active_date
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Updates the given entity in the database
	 * @params employee_calender
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(employee_calender) {
		let sqlRequest = `UPDATE employee_calender SET
			employee_id=$employee_id,
			calender_id=$calender_id,
			active_date=$active_date
			WHERE id=$id`;

		let sqlParams = {
			$id: employee_calender.id,
			$employee_id: employee_calender.employee_id,
			$calender_id: employee_calender.calender_id,
			$active_date: employee_calender.active_date
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params id
	 * returns database deletion status
	 */
	deleteById(id) {
		let sqlRequest = "DELETE FROM employee_calender WHERE id=$id";
		let sqlParams = {$id: id};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params id
	 * returns database deletion status
	 */
	deleteByEmpID(id) {
		let sqlRequest = "DELETE FROM employee_calender WHERE employee_id=$id";
		let sqlParams = {$id: id};
		return this.common.run(sqlRequest, sqlParams);
	};
}

module.exports = Employee_Calender;