/**
 * Department Entity (ES6 Class)
 */

class Department {
  constructor(id, name, description, subDepartment) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.subDepartment = subDepartment;
  }
}
module.exports = Department;