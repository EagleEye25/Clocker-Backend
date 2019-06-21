/* Load employee_card entity */
const employee_card = require('../model/employee_card');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Calender Data Access Object
 */
class Employee_Card {

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

module.exports = Employee_Card;