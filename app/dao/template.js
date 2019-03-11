/* Load Car entity */
const Employee = require('../model/employee');

/* Load DAO Common functions */
const daoCommon = require('./commons/daoCommon');

/**
 * Employee Data Access Object
 */
class EmployeeDao {

	constructor() {
		this.common = new daoCommon();
	}
}

module.exports = EmployeeDao;