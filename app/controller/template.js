/* Load Car Data Access Object */
const EmployeeDao = require('../dao/employeeDao');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

/* Load Employee entity */
const Employee = require('../model/employee');

/**
 * Car Controller
 */
class EmployeeController {

    constructor() {
        this.employeeDao = new EmployeeDao();
        this.common = new ControllerCommon();
    }
}

module.exports = EmployeeController;