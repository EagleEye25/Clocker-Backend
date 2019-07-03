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
	 * Tries to find entities
	 * @params
	 * @return entity
	 */
	async findAll() {
		let sqlRequest = "SELECT * FROM card";
		const rows = await this.common.findAll(sqlRequest);
		let cards = [];
		for (const row of rows) {
			cards.push(new card(row.id, row.card_no));
		}
		return cards;
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

	/**
	 * Creates the given entity in the database
	 * @params Card
	 * returns database insertion status
	 */
	create(card) {
		let sqlRequest = `INSERT into card (card_no)
			VALUES ($card)`;
		let sqlParams = {
			$card: card.card_no
		};
		return this.common.run(sqlRequest, sqlParams);
	};

	/**
	 * Tries to find all entities that arent linked to another employee
	 * @return entity
	 */
	async findCardsNotLinked() {
		let sqlRequest = `
			SELECT c.id, c.card_no
			FROM card c
			LEFT JOIN employee_card ec ON ec.card_id = c.id
			WHERE ec.card_id IS NULL`;
			// SELECT card.id, card.card_no
			// FROM card, employee_card
			// WHERE card.id NOT IN employee_card
			const rows = await this.common.findAll(sqlRequest);
			let unlinkedCards = [];
			for (const row of rows) {
				unlinkedCards.push(new card(row.id, row.card_no));
			}
			return unlinkedCards;
	};

	/**
	 * Tries to find all entities that arent linked to another employee
	 * @return entity
	 */
	async findCardsAndState() {
		let sqlRequest = `
			SELECT 	card.*,
			CASE WHEN employee_card.card_id IS NULL THEN false ELSE true END AS assigned
			FROM	card
			LEFT JOIN employee_card ON employee_card.card_id = card.id`;
		const rows = await this.common.findAll(sqlRequest);
		let cardsAndStates = [];
		for (const row of rows) {
			cardsAndStates.push({
				"id": row.id,
				"card_no": row.card_no,
				"assigned": row.assigned
			});
		}
		return cardsAndStates;
	};
}

module.exports = Card;