/**
 * Reason Entity (ES6 Class)
 */

class Reason {
  constructor(id, description, work, active) {
    this.id = id;
    this.description = description;
    this.work = work;
    this.active = active;
  }
}

module.exports = Reason