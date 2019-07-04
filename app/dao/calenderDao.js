/* Load calender entity */
const calender = require('../model/calender');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Calender Data Access Object
 */
class Calender {

	constructor() {
		this.common = new daoCommon();
	}

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params id
	 * @return entity
	 */
	async findById(id) {
		let sqlRequest = "SELECT * FROM calender WHERE id=$id";
		let sqlParams = {$id: id};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		return new calender(row.id, row.description, row.work);
	};

	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findAll() {
		let sqlRequest = "SELECT * FROM calender";
		const rows = await this.common.findAll(sqlRequest);
		let calenders = [];
		for (const row of rows) {
			calenders.push(new calender(row.id, row.name, row.description));
		}
		return calenders;
	};

	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findUnassigned() {
		let sqlRequest = `
			SELECT c.*
			FROM calender c
			LEFT JOIN calender_times ct ON ct.calender_id = c.id
			WHERE ct.calender_id IS NULL
		`;
		const rows = await this.common.findAll(sqlRequest);
		let calenders = [];
		for (const row of rows) {
			calenders.push(new calender(row.id, row.name, row.description));
		}
		return calenders;
	};

	/**
	 * Creates the given entity in the database
	 * @params Calender
	 * returns database insertion status
	 */
	create(calender) {
		let sqlRequest = `INSERT into calender (name, description)
				VALUES ($name, $description)`;

		let sqlParams = {
			$name: calender.name,
			$description: calender.description
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Updates the given entity in the database
	 * @params Calender
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(calender) {
		let sqlRequest = `UPDATE calender SET
			name=$name,
			description=$description
			WHERE id=$id`;

		let sqlParams = {
			$id: calender.id,
			$name: calender.name,
			$description: calender.description
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params id
	 * returns database deletion status
	 */
	deleteById(id) {
		let sqlRequest = "DELETE FROM calender WHERE id=$id";
		let sqlParams = {$id: id};
		return this.common.run(sqlRequest, sqlParams);
	};
}

module.exports = Calender;