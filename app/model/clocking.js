/**
 * Clocking Entity (ES6 Class)
 */

class Clocking {
  constructor(id, employee_id, reason_id, clock_in, clock_out, overtime) {
    this.id = id;
    this.employee_id = employee_id;
    this.reason_id = reason_id;
    this.clock_in = clock_in;
    this.clock_out = clock_out;
    this.overtime = overtime;
  }
}

module.exports = Clocking;