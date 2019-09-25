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
		if (!row) {
			return 'Doesnt Exist';
		}
		return new employee(row.id, row.name, row.admin, row.reporting_admin, row.password, row.calender_id, row.active);
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
			employees.push(new employee(row.id, row.name, row.admin, row.reporting_admin, row.password, row.calender_id, row.active));
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
			employees.push(new employee(row.id, row.name, row.admin, row.reporting_admin, row.password, row.active));
		}
		return employees;
	};

	/**
	 * Returns the employee based on the card number
	 * @return employee or null if no active employee is found
	 */
	async findEmployeeByCard(cardNo) {
		let sqlRequest = `
		SELECT 	e.*
		FROM		card c
						INNER JOIN employee_card ec ON ec.card_id = c.id
						INNER JOIN employee e ON e.id = ec.employee_id
		WHERE		c.card_no = $cardNo
		AND			ec.active = 1
		AND			e.active = 1`;
		const sqlParams = {$cardNo: cardNo};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		if (!row) {
			return null;
		}
		return new employee(row.id, row.name, row.admin, row.reporting_admin, row.password, row.calender_id, row.active);
	};

	// // TODO: fix
	// /**
	//  * Tries to find all entities
	//  * @return entity
	//  */
	async findAssignedToCal(calID) {
		let sqlRequest = `
			SELECT e.*
			FROM employee_calender ec
			INNER JOIN employee e ON ec.employee_id = e.id
			WHERE ec.calender_id = ` + calID.toString();

		const rows = await this.common.findAll(sqlRequest);
		let employees = [];
		for (const row of rows) {
			employees.push(new employee(row.id, row.name, row.admin, row.reporting_admin, row.active));
		}
		return employees;
	};

	// TODO: FIX
	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findUnassignedTOCal(calID) {
		let sqlRequest = `
		SELECT	e.*
		FROM	employee e
		LEFT JOIN employee_calender ec ON e.id = ec.employee_id
		WHERE	(coalesce(ec.calender_id, 0) NOT IN (` + calID.toString() + `))`;

		const rows = await this.common.findAll(sqlRequest);
		let employees = [];
		for (const row of rows) {
			// if (row.active === 0) {
				employees.push(new employee(row.id, row.name, row.admin, row.reporting_admin, row.active));
			// }
		}
		return employees;
	};

	/**
	 * Creates the given entity in the database
	 * @params Employee
	 * returns database insertion status
	 */
	async create(employee) {
		let sqlRequest = "INSERT into employee (name, admin, reporting_admin, password, active) " +
				"VALUES ($name, $admin, $reporting_admin, $password, $active)";
		let sqlParams = {
			$name: employee.name,
			$admin: employee.admin,
			$reporting_admin: employee.reporting_admin,
			$password: employee.password,
			$active: employee.active,
		};
		const req = await this.common.run(sqlRequest, sqlParams)
			.then(async() => {
				const emp =  await this.findByName(employee.name);
				return emp;
			})
			return(req);
	};

	/**
	 * Updates the given entity in the database
	 * @params Employee
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(employee) {
		let sqlRequest = `UPDATE employee SET
			name=$name,
			admin=$admin,
			reporting_admin=$reporting_admin,
			password=$password,
			active=$active
			WHERE id=$id`;

		let sqlParams = {
			$id: employee.id,
			$name: employee.name,
			$admin: employee.admin,
			$reporting_admin: employee.reporting_admin,
			$password: employee.password,
			$active: employee.active
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Updates the given entity in the database
	 * @params Employee
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	delete(emp) {
		let sqlRequest = `UPDATE employee SET
			active = $active
			WHERE id=$id`;

		let sqlParams = {
			$id : emp.id,
			$active: emp.active,
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

	/**
	 * Tries to find an entity using its namey
	 * @params id
	 * @return entity
	 */
	findAdmin() {
		let sqlRequest = `
		SELECT (1) AS found
		FROM employee
		WHERE admin=1
		AND active=1`;
		return this.common.findOne(sqlRequest).catch((err) => {
			return false;
		});
	}
}

module.exports = Employee;