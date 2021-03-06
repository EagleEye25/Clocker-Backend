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
	 * Tries to find all entities
	 * @params res
	 * @return entity
	 */
	findUnassigned(req, res) {
		this.dao.findUnassigned(req.params.calID)
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

	/**
	 * Tries to find all entities
	 * @params res
	 * @return entity
	 */
	findExisting(req, res) {
		let c_times = new calender_timesM();

		c_times.startWeek = req.body.sWeek;
		c_times.startDay = req.body.sDay;
		c_times.startTime = req.body.sTime;
		c_times.endDay = req.body.eDay;
		c_times.endTime = req.body.eTime;

		this.dao.findExisting(c_times)
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
		c_times.startWeek = req.body.startWeek;
		c_times.startDay = req.body.startDay;
		c_times.startTime = req.body.startTime;
		c_times.endDay = req.body.endDay;
		c_times.endTime = req.body.endTime;

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
		c_times.startWeek = req.body.startWeek;
		c_times.startDay = req.body.startDay;
		c_times.startTime = req.body.startTime;
		c_times.endDay = req.body.endDay;
		c_times.endTime = req.body.endTime;

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

	/**
	 * Tries to find all entities
	 * @params res
	 * @return entity
	 */
	findAssignedToCal(req, res) {
		let calID = req.params.calID;
		this.dao.findAssignedToCal(calID)
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

	/**
	 * Deletes an entity using its Id / Primary Key
	 * @params req, res
	 * returns database deletion status
	 */
	unassignFromCal(req, res) {
		let id = req.params.id;
		this.dao.unassignFromCal(id)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};
}

module.exports = Calender_Times;