/**
 * Calender Times Entity (ES6 Class)
 */

class Calender_Times {
  constructor(id, calender_id, start, end) {
    this.id = id;
    this.calender_id = calender_id;
    this.start = start;
    this.end = end;
  }
}

module.exports = Calender_Times;