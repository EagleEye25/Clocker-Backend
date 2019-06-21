/* Load Employee_Card Data Access Object */
const E_CardDAO = require('../dao/employee_cardDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const E_Card = require('../model/employee_card');

/**
 * Car Controller
 */
class Employee_Card {

	constructor() {
		this.dao = new E_CardDAO();
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
		let e_card = new E_Card();
		if (!req.body) {
			return this.common.findError(res);
		}

		e_card.employee_id = req.body.employee_id;
		e_card.card_id = req.body.card_id;
		e_card.issued_at = req.body.issued_at;
		e_card.active = req.body.active;

		return this.dao.create(e_card)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};

	/**
	 * Updates the given entity in the database
	 * @params req, res
	 * @return true if the entity has been updated, false if not found and not updated
	 */
	update(req, res) {
		let e_card = new E_Card();
		e_card.id = req.body.id;
		e_card.employee_id = req.body.employee_id;
		e_card.card_id = req.body.card_id;
		e_card.issued_at = req.body.issued_at;
		e_card.active = req.body.active;

		return this.dao.update(e_card)
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

module.exports = Employee_Card;