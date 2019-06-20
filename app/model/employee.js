/**
 * Employee Entity (ES6 Class)
 */

class Employee {
  constructor(id, name, admin, reporting_admin, password ,calender_id) {
    this.id = id;
    this.name = name;
    this.admin = admin;
    this.reporting_admin = reporting_admin;
    this.password = password;
    this.calender_id = calender_id;
  }
}

module.exports = Employee;