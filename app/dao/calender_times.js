/* Load calender_times entity */
const calender_times = require('../model/calender_times');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * calender_times Data Access Object
 */
class Calender_Times {

	constructor() {
		this.common = new daoCommon();
	}

	/**
     * Tries to find an entity using its Id / Primary Key
     * @params id
     * @return entity
     */
  //   findById(id) {
	// 		let sqlRequest = "SELECT * FROM employee WHERE id=$id";
	// 		let sqlParams = {$id: id};
	// 		return this.common.findOne(sqlRequest, sqlParams).then(row =>
	// 			new Employee(row.id, row.name, row.admin, row.reporting_admin, row.password, row.calender_id)
	// 		);
	// };
}

module.exports = Calender_Times;