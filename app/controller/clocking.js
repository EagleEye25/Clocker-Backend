/* Load Clocking Data Access Object */
const ClockingDAO = require('../dao/clockingDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

const cardCon = require('./card');
const employee_cardCon = require('./employee_card');

/* Load Employee entity */
const clockingM = require('../model/clocking');

/**
 * Car Controller
 */
class Clocking {

	constructor() {
		this.dao = new ClockingDAO();
		this.common = new ControllerCommon();
	}

	/**
	 * Tries to find all entities
	 * @params res
	 * @return entity
	 */
	findAll(res) {
		this.dao.findAll()
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

		/**
	 * Tries to find an entity
	 * @params res
	 * @return entity
	 */
	determineAction(req, res) {
		let cardNo = req.params.card_no;

		this.dao.determineAction(cardNo)
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

	/**
	 * Creates the given entity in the database
	 * @params req, res
	 * returns database insertion status
	 */
	clockIn(req, res) {
		let clocking = new clockingM();
		if (!req.body) {
			return this.common.findError(res);
		}

		clocking.employee_id = req.body.employee_id;
		clocking.reason_id = req.body.reason_id;
		clocking.clock_in = req.body.clock_in;
		clocking.clock_out = req.body.clock_out;

		return this.dao.clockIn(clocking)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};

	/**
	 * Updates the given entity in the database
	 * @params req, res
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	clockOut(req, res) {
		let clocking = new clockingM();
		clocking.id = req.body.id;
		clocking.employee_id = req.body.employee_id;
		clocking.reason_id = req.body.reason_id;
		clocking.clock_in = req.body.clock_in;
		clocking.clock_out = req.body.clock_out;

		return this.dao.clockOut(clocking)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params req, res
	 * @return entity
	 */
	findByEmployee(req, res) {
		let employee_id = req.params.employee_id;

		this.dao.findByEmployee(employee_id)
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};
}

module.exports = Clocking;