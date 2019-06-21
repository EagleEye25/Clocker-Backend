/* Load Calender Data Access Object */
const CalenderDAO = require('../dao/calenderDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const calenderM = require('../model/calender');

/**
 * Calender Controller
 */
class Calender {

	constructor() {
		this.dao = new CalenderDAO();
		this.common = new ControllerCommon();
	}

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params req, res
	 * @return entity
	 */
	findById(req, res) {
		if (!req.params.id) {
			return this.common.findError(res);
		}
		let id = req.params.id;

		this.dao.findById(id)
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

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
	 * Creates the given entity in the database
	 * @params req, res
	 * returns database insertion status
	 */
	create(req, res) {
		let calender = new calenderM();
		if (!req.body) {
			return this.common.findError(res);
		}

		calender.name = req.body.name;
		calender.description = req.body.description;

		return this.dao.create(calender)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};

	/**
	 * Updates the given entity in the database
	 * @params req, res
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(req, res) {
		let calender = new calenderM();

		calender.id = req.body.id;
		calender.name = req.body.name;
		calender.description = req.body.description;

		return this.dao.update(calender)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params req, res
	 * returns database deletion status
	 */
	deleteById(req, res) {
		let id = req.params.id;

		this.dao.deleteById(id)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};
}

module.exports = Calender;