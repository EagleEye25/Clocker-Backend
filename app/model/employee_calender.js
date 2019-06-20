/**
 * Employee Calander Entity (ES6 Class)
 */

class Employee_Calander {
  constructor(id, employee_id, calender_id, active_date) {
    this.id = id;
    this.employee_id = employee_id;
    this.calender_id = calender_id;
    this.active_date = active_date;
  }
}

module.exports = Employee_Calander;