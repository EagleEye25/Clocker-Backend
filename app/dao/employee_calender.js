/* Load employee_calender entity */
const employee_calender = require('../model/employee_calander');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Calender Data Access Object
 */
class Employee_Calender {

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

module.exports = Employee_Calender;