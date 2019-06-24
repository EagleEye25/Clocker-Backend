/* Load clocking entity */
const clocking = require('../model/clocking');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Calender Data Access Object
 */
class Clocking {

	constructor() {
		this.common = new daoCommon();
	}

	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findAll() {
		let sqlRequest = "SELECT * FROM clocking";
		const rows = await this.common.findAll(sqlRequest);
		let clockings = [];
		for (const row of rows) {
			clockings.push(new clocking(row.id, row.employee_id, row.reason_id, row.clock_in,
				row.clock_out, row.overtime));
		}
		return clockings;
	};

	/**
	 * Tries to find all entities
	 * @return entity
	 */
	async findByEmployee(employee_id) {
		let sqlRequest = "SELECT * FROM clocking WHERE employee_id=$employee_id";
		let sqlParams = {$employee_id: employee_id};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		return new clocking(row.id, row.employee_id, row.reason_id, row.clock_in,
			row.clock_out, row.overtime);
	};

	/**
	 * Creates the given entity in the database
	 * @params Clocking
	 * returns database insertion status
	 */
	clockIn(clocking) {
		let sqlRequest = `INSERT into clocking (employee_id, reason_id, clock_in,
											clock_out, overtime)
			VALUES ($employee_id, $reason_id, $clock_in, $clock_out, $overtime)`;
		let sqlParams = {
			$employee_id: clocking.employee_id,
			$reason_id: clocking.reason_id,
			$clock_in: clocking.clock_in,
			$clock_out: clocking.clock_out,
			$overtime: clocking.overtime
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Updates the given entity in the database
	 * @params clocking
	 * returns database insertion status
	 */
	clockOut(clocking) {
		let sqlRequest = `UPDATE clocking SET
			employee_id=$employee_id,
			reason_id=$reason_id,
			clock_in=$clock_in,
			clock_out=$clock_out,
			overtime=$overtime
			WHERE id=$id`;

		let sqlParams = {
			$id: clocking.id,
			$employee_id: clocking.employee_id,
			$reason_id: clocking.reason_id,
			$clock_in: clocking.clock_in,
			$clock_out: clocking.clock_out,
			$overtime: clocking.overtime
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	async determineAction(card_no) {
		let sqlRequest = `
		SELECT clocking.id, clocking.employee_id, clocking.clock_in, clocking.clock_out
		FROM  clocking
		LEFT JOIN card ON card.id = employee_card.card_id
    LEFT JOIN employee_card ON clocking.employee_id = employee_card.employee_id
		WHERE card.card_no = $card_no
		ORDER BY clocking.id DESC LIMIT 1`;

		let sqlParams = {$card_no: card_no};
		const row = await this.common.findOne(sqlRequest, sqlParams);

		let data = {
			id: row.id,
			employee_id: row.employee_id,
			action: ''
		}

		if (row.clock_out == null) {
			data.action = 'Clock_Out';
			return data;
		} else {
			data.action = 'Clock_In';
			return data;
		}
	}
}

module.exports = Clocking;