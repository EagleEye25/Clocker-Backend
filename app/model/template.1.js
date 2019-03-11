/**
 * Employee Entity (ES6 Class)
 */

class Employee {
  constructor(id, name, surName, empID, phone, email, department, tagID) {
      this.id = id;
      this.name = name;
      this.surName = surName;
      this.empID = empID;
      this.phone = phone;
      this.email = email;
      this.department = department;
      this.tagID = tagID;
  }
}

module.exports = Employee;