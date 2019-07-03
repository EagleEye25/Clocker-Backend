/**
 * Calender Times Entity (ES6 Class)
 */

class Calender_Times {
  constructor(id, calender_id, startWeek, startDay, startTime, endWeek, endDay, endTime) {
    this.id = id;
    this.calender_id = calender_id;
    this.startWeek = startWeek;
    this.startDay = startDay;
    this.startTime = startTime;
    this.endWeek = endWeek;
    this.endDay = endDay;
    this.endTime = endTime;
  }
}

module.exports = Calender_Times;