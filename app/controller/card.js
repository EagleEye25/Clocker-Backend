/* Load Card Data Access Object */
const CardDAO = require('../dao/cardDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const cardM = require('../model/card');

/**
 * Car Controller
 */
class Card {

	constructor() {
		this.dao = new CardDAO();
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
	 * Tries to find an entity using its Id / Primary Key
	 * @params req, res
	 * @return entity
	 */
	findById(req, res) {
		let id = req.params.id;

		this.dao.findById(id)
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params req, res
	 * @return entity
	 */
	findByCard_No(req, res) {
		let card_no = req.params.card_no;

		this.dao.findByCard_No(card_no)
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

	/**
	 * Tries to find entities using
	 * @params res
	 * @return entity
	 */
	findCardsNotLinked(res) {
		this.dao.findCardsNotLinked()
			.then(this.common.findSuccess(res))
			.catch(this.common.findError(res));
	};

	/**
	 * Creates the given entity in the database
	 * @params req, res
	 * returns database insertion status
	 */
	create(req, res) {
		let card = new cardM();
		if (!req.body.card_no) {
			return this.common.findError(res);
		}

		card.card_no = req.body.card_no;

		return this.dao.create(card)
			.then(this.common.editSuccess(res))
			.catch(this.common.serverError(res));
	};
}

module.exports = Card;