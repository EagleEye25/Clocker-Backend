/* Load clocking entity */
const clocking = require('../model/clocking');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

const Employee = require('../dao/employeeDao');
const emp = new Employee();

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
				row.clock_out));
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
			row.clock_out);
	};

	/**
	 * Creates the given entity in the database
	 * @params Clocking
	 * returns database insertion status
	 */
	clockIn(clocking) {
		let sqlRequest = `INSERT into clocking (employee_id, reason_id, clock_in,
											clock_out)
			VALUES ($employee_id, $reason_id, $clock_in, $clock_out)`;
		let sqlParams = {
			$employee_id: clocking.employee_id,
			$reason_id: clocking.reason_id,
			$clock_in: clocking.clock_in,
			$clock_out: clocking.clock_out,
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
			WHERE id=$id`;

		let sqlParams = {
			$id: clocking.id,
			$employee_id: clocking.employee_id,
			$reason_id: clocking.reason_id,
			$clock_in: clocking.clock_in,
			$clock_out: clocking.clock_out,
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	// TODO: FIX for when no records in db

	async determineAction(card_no) {
		let sqlRequest = `
		SELECT clocking.id, clocking.employee_id, clocking.clock_in, clocking.clock_out
		FROM  clocking
		LEFT JOIN card ON card.id = employee_card.card_id
    LEFT JOIN employee_card ON clocking.employee_id = employee_card.employee_id
		WHERE card.card_no = $card_no
		ORDER BY clocking.id DESC LIMIT 1`;

		let sqlParams = {$card_no: card_no};
		let data;
		let create;
		const row = await this.common.findOne(sqlRequest, sqlParams).then(() => {
			console.log('then');
		  data = {
				id: row.id,
				employee_id: row.employee_id,
				action: ''
			}

			if (row.clock_out == null) {
				data.action = 'Clock_Out';
				data.clock_in = row.clock_in;
				return data;
			} else {
				data.action = 'Clock_In';
				return data;
			}
		}).catch(async(err) => {
			console.log('catch');
			create = await emp.findEmployeeByCard(card_no).then((found) => {
				found.action = 'Clock_In';
				create = found;
				return found;
			});
			console.log('return', create);
			return create;
		});
	}
}

module.exports = Clocking;