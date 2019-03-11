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

	/**
     * Tries to find an entity using its Id / Primary Key
     * @params id
     * @return entity
     */
    findById(id) {
			let sqlRequest = "SELECT * FROM employee WHERE id=$id";
			let sqlParams = {$id: id};
			return this.common.findOne(sqlRequest, sqlParams).then(row =>
				new Employee(row.id, row.name, row.surName, row.empID, row.phone, row.email, row.department, row.tagID)
			);
	};
}

module.exports = EmployeeDao;