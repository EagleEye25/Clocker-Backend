/**
 * Employee Entity (ES6 Class)
 */

class Employee {
  constructor(id, name, admin, reporting_admin, password ,calender_id, active, is_logged_out, reason_description, work_related_reason) {
    this.id = id;
    this.name = name;
    this.admin = admin;
    this.reporting_admin = reporting_admin;
    this.password = password;
    this.calender_id = calender_id;
    this.active = active;
    this.is_logged_out = is_logged_out;
    this.reason_description = reason_description;
    this.work_related_reason = work_related_reason;
  }
}

module.exports = Employee;