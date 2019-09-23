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
	async clockOut(clocking) {
		let sqlRequest = `UPDATE clocking SET
			reason_id=$reason_id,
			clock_out=$clock_out
			WHERE id=$id`;

		let sqlParams = {
			$id: clocking.id,
			$reason_id: clocking.reason_id,
			$clock_out: clocking.clock_out,
		};

		return await this.common.run(sqlRequest, sqlParams);
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
		const row = await this.common.findOne(sqlRequest, sqlParams).then((result) => {
		  const data = {
				id: result.id,
				employee_id: result.employee_id,
				action: ''
			}

			if (result.clock_out == null) {
				data.action = 'Clock_Out';
				data.clock_in = result.clock_in;
				return data;
			} else {
				data.action = 'Clock_In';
				return data;
			}
		}).catch(async(err) => {
			const create = await emp.findEmployeeByCard(card_no).catch(() => {
				return { id: null };
			});

			const data = {
				id: null,
				employee_id: create.id,
				action: 'Clock_In'
			};
			return data;
		});

		return row;
	}
}

module.exports = Clocking;