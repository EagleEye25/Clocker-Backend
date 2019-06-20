/* Load reason entity */
const reason = require('../model/reason');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Calender Data Access Object
 */
class Reason {

	constructor() {
		this.common = new daoCommon();
	}

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params id
	 * @return entity
	 */
	async findById(id) {
		let sqlRequest = "SELECT * FROM reason WHERE id=$id";
		let sqlParams = {$id: id};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		return new reason(row.id, row.description, row.work);
	};

	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findAll() {
		let sqlRequest = "SELECT * FROM reason";
		const rows = await this.common.findAll(sqlRequest);
		let reasons = [];
		for (const row of rows) {
			reasons.push(new reason(row.id, row.description, row.work));
		}
		return reasons;
	};

	/**
	 * Creates the given entity in the database
	 * @params Employee
	 * returns database insertion status
	 */
	create(reason) {
		let sqlRequest = "INSERT into reason (description, work) " +
				"VALUES ($description, $work)";
		let sqlParams = {
			$description: reason.description,
			$work: reason.work
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Updates the given entity in the database
	 * @params Employee
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(reason) {
		let sqlRequest = "UPDATE reason SET " +
			"description=$description, " +
			"work=$work " +
			"WHERE id=$id";

		let sqlParams = {
			$id: reason.id,
			$description: reason.description,
			$work: reason.work
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params id
	 * returns database deletion status
	 */
	deleteById(id) {
		let sqlRequest = "DELETE FROM reason WHERE id=$id";
		let sqlParams = {$id: id};
		return this.common.run(sqlRequest, sqlParams);
	};
}

module.exports = Reason;