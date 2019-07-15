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
			c_times.push(new calender_times(row.id, row.calender_id, row.startWeek, row.startDay, row.startTime, row.endDay, row.endTime));
		}
		return c_times;
	};

	/**
	 * Tries to find entity
	 * @return entity
	 */
	async findExisting(c_times) {
		let sqlRequest = `
			SELECT *
			FROM calender_times ct
			WHERE ct.startWeek = $startWeek
			AND ct.startDay = $startDay
			AND ct.startTime = $startTime
			AND ct.endDay = $endDay
			AND ct.endTime = $endTime
		`;
		let sqlParams = {
			$startWeek: c_times.startWeek,
			$startDay: c_times.startDay,
			$startTime: c_times.startTime,
			$endDay: c_times.endDay,
			$endTime: c_times.endTime
		};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		return new calender_times(row.id, row.calender_id, row.startWeek, row.startDay, row.startTime, row.endDay, row.endTime);
	};

	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findUnassigned() {
		let sqlRequest = `
			SELECT *
			FROM calender_times
			WHERE calender_id IS NUll`;
		const rows = await this.common.findAll(sqlRequest);
		let c_times = [];
		for (const row of rows) {
			c_times.push(new calender_times(row.id, row.calender_id, row.startWeek, row.startDay, row.startTime, row.endDay, row.endTime));
		}
		return c_times;
	};

	// TODO: return ID after creating
	/**
	 * Creates the given entity in the database
	 * @params Calender_Times
	 * returns database insertion status
	 */
	async create(c_times) {
		let sqlRequest = `INSERT into calender_times (calender_id, startWeek, startDay, startTime, endDay, endTime)
				VALUES ($calender_id, $startWeek, $startDay, $startTime, $endDay, $endTime)`;
		let sqlParams = {
			$calender_id: c_times.calender_id,
			$startWeek: c_times.startWeek,
			$startDay: c_times.startDay,
			$startTime: c_times.startTime,
			$endDay: c_times.endDay,
			$endTime: c_times.endTime
		};
		let time = c_times;
		let req = await this.common.run(sqlRequest, sqlParams)
			.then(async() => {
				console.log(time);
				const calTimes = await this.findExisting(time);
				return calTimes
			})
			return(req);

// TODO: create method to find calendar times
		// const req = await this.common.run(sqlRequest, sqlParams)
		// .then(async() => {
		// 	const cTime =  await this.findByName(employee.name);
		// 	return cTime;
		// })
		// return(req);



	};

	/**
	 * Updates the given entity in the database
	 * @params Calender_Times
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(c_times) {
		let sqlRequest = `UPDATE calender_times SET
			calender_id=$calender_id,
			startWeek = $startWeek,
			startDay = $startDay,
			startTime = $startTime,
			endDay = $endDay,
			endTime = $endTime
			WHERE id=$id`;

		let sqlParams = {
			$id: c_times.id,
			$calender_id: c_times.calender_id,
			$startWeek: c_times.startWeek,
			$startDay: c_times.startDay,
			$startTime: c_times.startTime,
			$endDay: c_times.endDay,
			$endTime: c_times.endTime
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