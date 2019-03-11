/**
 * Employee Entity (ES6 Class)
 */

class Employee {
  constructor(id, timeIn, timeOut, empID, empCalander) {
    this.id = id;
    this.timeIn = timeIn;
    this.timeOut = timeOut;
    this.empID = empID;
    this.empCalander = empCalander;
  }
}

module.exports = Employee;