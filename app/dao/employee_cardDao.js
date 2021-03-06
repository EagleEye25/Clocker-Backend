/* Load employee_card entity */
const employee_card = require('../model/employee_card');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Calender Data Access Object
 */
class Employee_Card {

	constructor() {
		this.common = new daoCommon();
	}

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params id
	 * @return entity
	 */
	async findById(id) {
		let sqlRequest = "SELECT * FROM employee_card WHERE id=$id";
		let sqlParams = {$id: id};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		return new employee_card(row.id, row.employee_id, row.card_id, row.issued_at, row.active);
	};

	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findAll() {
		let sqlRequest = `
			SELECT  ec.*,
			c.card_no,
			e.name
			FROM employee_card ec
			INNER JOIN employee e  ON e.id = ec.employee_id
			LEFT JOIN card c ON c.id = ec.card_id`;
		const rows = await this.common.findAll(sqlRequest);
		let cards = [];
		for (const row of rows) {
			cards.push({
				"id": row.id,
				"employee_id": row.employee_id,
				"card_id": row.card_id,
				"issued_at": row.issued_at,
				"active": row.active,
				"name": row.name,
				"card_no": row.card_no
			});
		}
		return cards;
	};

	/**
	 * Creates the given entity in the database
	 * @params Employee_Card
	 * returns database insertion status
	 */
	create(employee_card) {
		let sqlRequest = "INSERT into employee_card (employee_id, card_id, issued_at, active) " +
				"VALUES ($employee_id, $card_id, $issued_at, $active)";
		let sqlParams = {
			$employee_id: employee_card.employee_id,
			$card_id: employee_card.card_id,
			$issued_at: employee_card.issued_at,
			$active: employee_card.active
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Updates the given entity in the database
	 * @params employee_card
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(employee_card) {
		let sqlRequest = `UPDATE employee_card SET
			employee_id=$employee_id,
			card_id=$card_id,
			issued_at=$issued_at,
			active=$active
			WHERE id=$id`;

		let sqlParams = {
			$id: employee_card.id,
			$employee_id: employee_card.employee_id,
			$card_id: employee_card.card_id,
			$issued_at: employee_card.issued_at,
			$active: employee_card.active
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params id
	 * returns database deletion status
	 */
	deleteById(id) {
		let sqlRequest = "DELETE FROM employee_card WHERE id=$id";
		let sqlParams = {$id: id};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params id
	 * @return entity
	 */
	async findByEmpId(id) {
		let sqlRequest = "SELECT * FROM employee_card WHERE id=$id";
		let sqlParams = {$id: id};
		const row = await this.common.findOne(sqlRequest, sqlParams)
		.then(() => {
			return true;
		}).catch(() => {
			return false
		})

		return row;
	};

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params id
	 * returns database deletion status
	 */
	deleteByEmpID(id) {
		let sqlRequest = "DELETE FROM employee_card WHERE employee_id=$id";
		let sqlParams = {$id: id};
		return this.common.run(sqlRequest, sqlParams);
	};
}

module.exports = Employee_Card;