/* Load calender_times entity */
const calender_times = require('../model/calender_times');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * calender_times Data Access Object
 */
class Calender_Times {

	constructor() {
		this.common = new daoCommon();
	}

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params id
	 * @return entity
	 */
	async findById(id) {
		let sqlRequest = "SELECT * FROM calender_times WHERE id=$id";
		let sqlParams = {$id: id};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		return new calender_times(row.id, row.calender_id, row.start, row.end);
	};

	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findAll() {
		let sqlRequest = "SELECT * FROM calender_times";
		const rows = await this.common.findAll(sqlRequest);
		let c_times = [];
		for (const row of rows) {
			c_times.push(new calender_times(row.id, row.calender_id, row.start, row.end));
		}
		return c_times;
	};

	/**
	 * Creates the given entity in the database
	 * @params Calender_Times
	 * returns database insertion status
	 */
	create(c_times) {
		let sqlRequest = `INSERT into calender_times (calender_id, start, end)
				VALUES ($calender_id, $start, $end)`;
		let sqlParams = {
			$calender_id: c_times.calender_id,
			$start: c_times.start,
			$end: c_times.end
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Updates the given entity in the database
	 * @params Calender_Times
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(c_times) {
		let sqlRequest = `UPDATE calender_times SET
			calender_id=$calender_id,
			start=$start,
			end=$end
			WHERE id=$id`;

		let sqlParams = {
			$id: c_times.id,
			$calender_id: c_times.calender_id,
			$start: c_times.start,
			$end: c_times.end
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params id
	 * returns database deletion status
	 */
	deleteById(id) {
		let sqlRequest = "DELETE FROM calender_times WHERE id=$id";
		let sqlParams = {$id: id};
		return this.common.run(sqlRequest, sqlParams);
	};
}

module.exports = Calender_Times;