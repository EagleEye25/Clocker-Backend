/**
 * Employee Card Entity (ES6 Class)
 */

class Employee_Card {
  constructor(id, employee_id, card_id, issued_at, active) {
    this.id = id;
    this.employee_id = employee_id;
    this.card_id = card_id;
    this.issued_at = issued_at;
    this.active = active;
  }
}

module.exports = Employee_Card;