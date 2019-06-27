/* Load Employee entity */
const employee = require('../model/employee');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Employee Data Access Object
 */
class Employee {

	constructor() {
		this.common = new daoCommon();
	}

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params id
	 * @return entity
	 */
	async findById(id) {
		let sqlRequest = "SELECT * FROM employee WHERE id=$id";
		let sqlParams = {$id: id};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		return new employee(row.id, row.name, row.admin, row.reporting_admin, row.password, row.calender_id);
	};

	/**
	 * Tries to find an entity using its namey
	 * @params id
	 * @return entity
	 */
	async findByName(name) {
		let sqlRequest = `
		SELECT *
		FROM employee
		WHERE name=$name`;
		let sqlParams = {$name: name};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		return new employee(row.id, row.name, row.admin, row.reporting_admin, row.password, row.calender_id);
	};

	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findAll() {
		let sqlRequest = "SELECT * FROM employee";
		const rows = await this.common.findAll(sqlRequest);
		let employees = [];
		for (const row of rows) {
			employees.push(new employee(row.id, row.name, row.admin, row.reporting_admin, row.password, row.calender_id));
		}
		return employees;
	};

	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findUnassingnedEmployees() {
		let sqlRequest = `
		SELECT employee.*
		FROM employee
		LEFT JOIN employee_card ON employee.id = employee_card.employee_id
		WHERE employee_card.employee_id IS NULL`;
		const rows = await this.common.findAll(sqlRequest);
		let employees = [];
		for (const row of rows) {
			employees.push(new employee(row.id, row.name, row.admin, row.reporting_admin, row.password, row.calender_id));
		}
		return employees;
	};

	/**
	 * Creates the given entity in the database
	 * @params Employee
	 * returns database insertion status
	 */
	create(employee) {
		let sqlRequest = "INSERT into employee (name, admin, reporting_admin, password, calender_id) " +
				"VALUES ($name, $admin, $reporting_admin, $password ,$calender_id)";
		let sqlParams = {
			$name: employee.name,
			$admin: employee.admin,
			$reporting_admin: employee.reporting_admin,
			$password: employee.password,
			$calender_id: employee.calender_id
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Updates the given entity in the database
	 * @params Employee
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(employee) {
		let sqlRequest = "UPDATE employee SET " +
			"name=$name, " +
			"admin=$admin, " +
			"reporting_admin=$reporting_admin, " +
			"password=$password, " +
			"calender_id=$calender_id " +
			"WHERE id=$id";

		let sqlParams = {
			$id: employee.id,
			$name: employee.name,
			$admin: employee.admin,
			$reporting_admin: employee.reporting_admin,
			$password: employee.password,
			$calender_id: employee.calender_id
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params id
	 * returns database deletion status
	 */
	deleteById(id) {
		let sqlRequest = "DELETE FROM employee WHERE id=$id";
		let sqlParams = {$id: id};
		return this.common.run(sqlRequest, sqlParams);
	};
}

module.exports = Employee;