/* Load calender_times Data Access Object */
const c_timesDAO = require('../dao/calender_timesDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const calender_timesM = require('../model/calender_times');

/**
 * Car Controller
 */
class Calender_Times {

	constructor() {
		this.dao = new c_timesDAO();
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
		let c_times = new calender_timesM();
		if (!req.body) {
			return this.common.findError(res);
		}

		c_times.calender_id = req.body.calender_id;
		c_times.start = req.body.start;
		c_times.end = req.body.end;

		return this.dao.create(c_times)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};

	/**
	 * Updates the given entity in the database
	 * @params req, res
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(req, res) {
		let c_times = new calender_timesM();

		c_times.id = req.body.id;
		c_times.calender_id = req.body.calender_id;
		c_times.start = req.body.start;
		c_times.end = req.body.end;

		return this.dao.update(c_times)
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

module.exports = Calender_Times;