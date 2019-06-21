/* Load card entity */
const card = require('../model/card');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Card Data Access Object
 */
class Card {

	constructor() {
		this.common = new daoCommon();
	}

	/**
	 * Tries to find an entity using its Id / Primary Key
	 * @params id
	 * @return entity
	 */
	async findById(id) {
		let sqlRequest = "SELECT * FROM card WHERE id=$id";
		let sqlParams = {$id: id};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		return new card(row.id, row.card_no);
	};

	/**
	 * Tries to find an entity using its card_no
	 * @params card_no
	 * @return entity
	 */
	async findByCard_No(card_no) {
		let sqlRequest = "SELECT * FROM card WHERE card_no=$card_no";
		let sqlParams = {$card_no: card_no};
		const row = await this.common.findOne(sqlRequest, sqlParams);
		return new card(row.id, row.card_no);
	};
}

module.exports = Card;