const DateFNGetMonth = require("date-fns/getMonth");
const DateFNGetDay = require("date-fns/getDay");
const DateFNStartOfDay = require("date-fns/startOfDay");
const DateFNEndOfDay = require("date-fns/endOfDay");
const DateFNDiffInMinutes = require("date-fns/differenceInMinutes");
const DateFNEndOfMonth = require("date-fns/endOfMonth");

/* Load Calender Data Access Object */
const reportsDao = require("../dao/reportsDao");

/* Load Controller Common function */
const ControllerCommon = require("./common/controllerCommon");

/**
 * Calender Controller
 */
class Reports {
  constructor() {
    this.dao = new reportsDao();
    this.common = new ControllerCommon();
  }

  /**
   * Tries to find all entities
   * @params res
   * @return entity
   */
  getUsersInAndOut(res) {
    this.dao
      .getUsersInAndOut()
      .then(this.common.findSuccess(res))
      .catch(this.common.findError(res));
  }

  /**
   * Return all admin report data
   * @params Filtering criteria
   * @param employeeIds Array<number> : Array of employee IDs to filter by. Empty array indicates all employees
   * @param start number : start timestamp of data to return
   * @param end number : end timestamp of data to return
   * @return Object containing report information
   */
  async allReports(employeeIds, start, end) {
    const results = {};

    const reports = [
      // define async reports data here
      {
        name: "Count of non-work related clock outs",
        fn: this.reportClockReasonsNonWork
      },
      {
        name: "Count of work related clock outs",
        fn: this.reportClockReasonsWork
      },
      { name: "Rank of clock out reasons used", fn: this.reportReasonsRank },
      { name: "Onsite vs OffSite Time logged", fn: this.reportWorkHours },
      { name: "Overtime Per Day of Week", fn: this.reportOvertimePerWeekDay },
      {
        name: "Time Spent per Clock-out Reason",
        fn: this.reportClockedOutTimes
      }
    ];

    // Fetch employee actual clocking in/out info
    const employeeData = await this.fetchEmployeeTimesData(
      start,
      end,
      employeeIds
    ).catch(err => {
      return {};
    });

    // Fetch calendar info
    const calendars = await this.fetchCalendarData(end, employeeIds).catch(
      err => {
        return {};
      }
    );

    // Fetch calendar to employee mapping
    const calIdFilter =
      Object.keys(calendars).length > 0
        ? Object.keys(calendars).map(calKey => calendars[calKey].id)
        : [];

    const mapCalEmp = await this.fetchCalendarEmployeeMap(
      end,
      employeeIds,
      calIdFilter
    ).catch(err => {
      return {};
    });

    // Add calender ID to each shift worked
    const employees = employeeData.data || [];
    for (const employee of employees) {
      const empCalendars = (
        (mapCalEmp[`${employee.id}`] || {}).calendars || []
      ).reverse();

      const shifts = employee.shifts || [];
      for (const shift of shifts) {
        const calIdx = empCalendars.findIndex(
          calObj => +shift.start > +calObj.from
        );
        if (calIdx > -1) {
          shift.calendarID = empCalendars[calIdx].id;
        }
      }
    }

    const reportInfo = {
      employeeData,
      calendars
    };

    // NB!!! Be very careful to NOT modify the data from inside each of the report functions
    const reportData = await Promise.all(
      reports.map(r => {
        const fn = r.fn.bind(this);
        return fn(reportInfo).catch(error => error);
      })
    );

    for (let ii = 0; ii < reportData.length; ++ii) {
      let report = {
        name: reports[ii].name,
        data: {}
      };

      if (!(reportData[ii] instanceof Error)) {
        report.data = reportData[ii];
      } else {
        console.log("Error occurred on report ", ii, " >>> ", reportData[ii]);
      }

      results[`${ii}`] = report;
    }

    return results;
  }

  async fetchEmployeeTimesData(start, end, employeeIds) {
    const retObject = {};
    const empData = {};
    let latest = 0;
    let earliest = Number.MAX_SAFE_INTEGER;

    const employeeRows = await this.dao
      .fetchReportEmployeeTimes(start, end, employeeIds)
      .catch(err => {
        return [];
      });

    employeeRows.forEach(emp => {
      const empID = `${emp.employee_id}`;
      if (!empData[empID]) {
        empData[empID] = {
          id: emp.employee_id,
          name: emp.employee_name,
          shifts: []
        };
      }

      if (typeof emp.clock_in === "number" && emp.clock_in < earliest) {
        earliest = emp.clock_in;
      }
      if (typeof emp.clock_out === "number" && emp.clock_out > latest) {
        latest = emp.clock_out;
      }
      empData[empID].shifts.push({
        start: emp.clock_in,
        end: emp.clock_out,
        reason: emp.reason_description,
        out_is_work_related: Boolean(+emp.work_related)
      });
    });

    const emps = Object.keys(empData).map(empKey => empData[empKey]);

    retObject.data = emps;
    if (earliest !== Number.MAX_SAFE_INTEGER) {
      retObject.earliest = earliest;
    }
    if (latest !== 0) {
      retObject.latest = latest;
    } else {
      retObject.latest = retObject.earliest;
    }

    return retObject;
  }

  async fetchCalendarData(end, employeeIds) {
    const retObject = {};

    const calenderRows = await this.dao
      .fetchReportCalendars(employeeIds, end)
      .catch(err => {
        return [];
      });

    calenderRows.forEach(row => {
      const calID = `${row.id}`;
      if (!retObject[calID]) {
        retObject[calID] = {
          id: row.id,
          name: row.name,
          weeks: []
        };
      }

      const calWeek = retObject[calID].weeks[+row.startWeek - 1];
      if (!calWeek) {
        retObject[calID].weeks[+row.startWeek - 1] = {
          num: +row.startWeek,
          shifts: []
        };
      }

      retObject[calID].weeks[+row.startWeek - 1].shifts.push({
        startDay: +row.startDay - 1,
        startTime: row.startTime,
        endDay: +row.endDay - 1,
        endTime: row.endTime,
        spansSingleDay: row.startDay === row.endDay
      });
    });

    return retObject;
  }

  async fetchCalendarEmployeeMap(end, employeeIds, calIdFilter) {
    const retObject = {};

    const mapRows = await this.dao
      .fetchReportEmployeeCalendars(end, employeeIds, calIdFilter)
      .catch(err => {
        return [];
      });

    mapRows.forEach(row => {
      const empID = `${row.employee_id}`;
      if (!retObject[empID]) {
        retObject[empID] = {
          id: row.employee_id,
          calendars: []
        };
      }

      retObject[empID].calendars.push({
        id: row.calender_id,
        from: row.active_date
      });
    });

    return retObject;
  }

  async reportClockReasonsNonWork(reportData) {
    const employeeObj =
      Object.prototype.toString.call(reportData) === "[object Object]"
        ? reportData.employees || {}
        : {};
    const employees =
      Object.prototype.toString.call(employeeObj) === "[object Object]"
        ? employeeObj.data || []
        : [];

    const reasons = {};

    for (const employee of employees) {
      const shifts = employee.shifts || [];
      for (const shift of shifts) {
        if (!shift.out_is_work_related) {
          if (!(shift.reason in reasons)) {
            reasons[shift.reason] = 0;
          }
          reasons[shift.reason] += 1;
        }
      }
    }
    return reasons;
  }

  async reportClockReasonsWork(reportData) {
    const employeeObj =
      Object.prototype.toString.call(reportData) === "[object Object]"
        ? reportData.employees || {}
        : {};
    const employees =
      Object.prototype.toString.call(employeeObj) === "[object Object]"
        ? employeeObj.data || []
        : [];

    const reasons = {};

    for (const employee of employees) {
      const shifts = employee.shifts || [];
      for (const shift of shifts) {
        if (shift.out_is_work_related) {
          if (!(shift.reason in reasons)) {
            reasons[shift.reason] = 0;
          }
          reasons[shift.reason] += 1;
        }
      }
    }

    return reasons;
  }

  async reportReasonsRank(reportData) {
    const employeeObj =
      Object.prototype.toString.call(reportData) === "[object Object]"
        ? reportData.employees || {}
        : {};
    const employees =
      Object.prototype.toString.call(employeeObj) === "[object Object]"
        ? employeeObj.data || []
        : [];

    const reasons = {};

    for (const employee of employees) {
      const shifts = employee.shifts || [];
      for (const shift of shifts) {
        if (!(shift.reason in reasons)) {
          reasons[shift.reason] = 0;
        }
        reasons[shift.reason] += 1;
      }
    }
  }

  async reportClockedOutTimes(reportData) {
    const employeeObj =
      Object.prototype.toString.call(reportData) === "[object Object]"
        ? reportData.employees || {}
        : {};
    const employees =
      Object.prototype.toString.call(employeeObj) === "[object Object]"
        ? employeeObj.data || []
        : [];

    const results = {
      totalPerReason: {},
      totalPerDay: {},
      reasonPerDay: {}
    };

    for (const employee of employees) {
      const shifts = employee.shifts || [];
      for (let ii = 0; ii < shifts.length; ++ii) {
        const shift = shifts[ii];
        if (+shift.end > 0 && ii < shifts.length - 1) {
          const shiftEndDate = new Date(+shift.end);
          const nextShiftStartDate = new Date(+shifts[ii + 1].start);

          const minOutPerDay = this.calculateMinutesWorkBetweenDates(
            nextShiftStartDate,
            shiftEndDate
          );

          const dayKeys = Object.keys(minOutPerDay);
          for (const dayKey of dayKeys) {
            if (!results.totalPerReason[shift.reason]) {
              results.totalPerReason[shift.reason] = 0;
            }
            results.totalPerReason[shift.reason] += minOutPerDay[dayKey];

            if (!results.totalPerDay[dayKey]) {
              results.totalPerDay[dayKey] = 0;
            }
            results.totalPerDay[dayKey] += minOutPerDay[dayKey];

            if (!results.reasonPerDay[dayKey]) {
              results.reasonPerDay[dayKey] = {};
            }
            if (!results.reasonPerDay[dayKey][shift.reason]) {
              results.reasonPerDay[dayKey][shift.reason] = 0;
            }
            results.reasonPerDay[dayKey][shift.reason] += minOutPerDay[dayKey];
          }
        }
      }
    }
    return results;
  }

  async reportWorkHours(reportData) {
    const employeeObj =
      Object.prototype.toString.call(reportData) === "[object Object]"
        ? reportData.employees || {}
        : {};
    const employees =
      Object.prototype.toString.call(employeeObj) === "[object Object]"
        ? employeeObj.data || []
        : [];

    const resultsMonth = {};
    const resultsDay = {};

    for (const employee of employees) {
      const shifts = employee.shifts || [];

      for (let ii = 0; ii < shifts.length; ++ii) {
        const shift = shifts[ii];
        const shiftStart = new Date(+shift.start);
        const shiftEnd = new Date(+shift.end);

        const monthStr = `${DateFNGetMonth(shiftStart)}`;
        const dayStr = `${DateFNGetDay(shiftStart)}`;

        if (!resultsMonth[monthStr]) {
          resultsMonth[monthStr] = {
            onSite: 0,
            offSite: 0
          };
        }

        if (!resultsDay[dayStr]) {
          resultsDay[dayStr] = {
            onSite: 0,
            offSite: 0
          };
        }

        if (+shift.end > 0) {
          // Calculate day and month on-site shift minutes worked

          let monthMinutes = 0;
          let dayMinutes = 0;

          if (shiftEnd > DateFNEndOfMonth(shiftStart)) {
            monthMinutes = DateFNDiffInMinutes(
              shiftEnd,
              DateFNEndOfMonth(shiftStart)
            );
            if (!resultsMonth[`${+monthStr + 1}`]) {
              resultsMonth[`${+monthStr + 1}`] = {
                onSite: 0,
                offSite: 0
              };
            }
            resultsMonth[`${+monthStr + 1}`].onSite += monthMinutes;
            monthMinutes = DateFNDiffInMinutes(
              DateFNEndOfMonth(shiftStart),
              shiftStart
            );
          } else {
            monthMinutes = DateFNDiffInMinutes(shiftEnd, shiftStart);
          }

          if (shiftEnd > DateFNEndOfDay(shiftStart)) {
            dayMinutes = DateFNDiffInMinutes(
              shiftEnd,
              DateFNEndOfDay(shiftStart)
            );
            if (!resultsDay[`${+dayStr + 1}`]) {
              resultsDay[`${+dayStr + 1}`] = {
                onSite: 0,
                offSite: 0
              };
            }
            resultsDay[`${+dayStr + 1}`].onSite += dayMinutes;
            dayMinutes = DateFNDiffInMinutes(
              DateFNEndOfDay(shiftStart),
              shiftStart
            );
          } else {
            dayMinutes = DateFNDiffInMinutes(shiftEnd, shiftStart);
          }

          resultsMonth[monthStr].onSite += monthMinutes;
          resultsDay[dayStr].onSite += dayMinutes;

          // Calculate day and month off-site shift minutes worked
          if (shift.out_is_work_related) {
            if (ii !== shifts.length - 1) {
              // there is another shift after this one, so the employee logged back in
              const nextShift = new Date(+shifts[ii + 1].start);
              const nextShiftMonthStr = `${DateFNGetMonth(nextShift)}`;
              const nextShiftDayStr = `${DateFNGetDay(nextShift)}`;

              if (!resultsMonth[nextShiftMonthStr]) {
                resultsMonth[nextShiftMonthStr] = {
                  onSite: 0,
                  offSite: 0
                };
              }

              if (!resultsDay[nextShiftDayStr]) {
                resultsDay[nextShiftDayStr] = {
                  onSite: 0,
                  offSite: 0
                };
              }

              // NB: There's a subtle bug in here (which is more relevant to the day calculations):
              //  Calculation is based on consecutive days... which means that
              //  if there are multiple days between the previous log out (for work purposes), and the next log in, then the offSite
              //  work minutes calulated is added to the day in which the user signs in again, rather than being distributed over the in-between days.
              //
              if (nextShiftMonthStr !== monthStr) {
                resultsMonth[monthStr].offSite += DateFNDiffInMinutes(
                  DateFNEndOfMonth(shiftEnd),
                  shiftEnd
                );
                resultsMonth[nextShiftMonthStr].offSite += DateFNDiffInMinutes(
                  nextShift,
                  DateFNEndOfMonth(shiftEnd)
                );
              } else {
                resultsMonth[monthStr].offSite += DateFNDiffInMinutes(
                  nextShift,
                  DateFNEndOfMonth(shiftEnd)
                );
              }

              if (nextShiftDayStr !== dayStr) {
                resultsDay[dayStr].offSite += DateFNDiffInMinutes(
                  DateFNEndOfMonth(shiftEnd),
                  shiftEnd
                );
                resultsDay[nextShiftDayStr].offSite += DateFNDiffInMinutes(
                  nextShift,
                  DateFNEndOfMonth(shiftEnd)
                );
              } else {
                resultsDay[dayStr].offSite += DateFNDiffInMinutes(
                  nextShift,
                  DateFNEndOfMonth(shiftEnd)
                );
              }
            }
          }
        }
      }
    }

    return {
      month: resultsMonth,
      day: resultsDay
    };
  }

  async reportOvertimePerWeekDay(reportData) {
    const employeeObj =
      Object.prototype.toString.call(reportData) === "[object Object]"
        ? reportData.employees || {}
        : {};
    const employees =
      Object.prototype.toString.call(employeeObj) === "[object Object]"
        ? employeeObj.data || []
        : [];

    const calendars =
      Object.prototype.toString.call(reportData) === "[object Object]"
        ? reportData.calendars || {}
        : {};

    const calendarDayTimes = {};

    const results = {};

    for (const employee of employees) {
      const shifts = employee.shifts || [];

      const timeLoggedPerDay = {
        "0": 0,
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0
      };
      let lastLogoutIsWork = false;

      for (let ii = 0; ii < shifts.length; ++ii) {
        const shift = shifts[ii];

        let doCalcOvertime = true;

        if (+shift.calendarID > 0 && +shift.end > 0) {
          let calIDStr = `${+shift.calendarID}`;

          if (!calendarDayTimes[calIDStr]) {
            calendarDayTimes[calIDStr] = this.calculateCalendarMinutesPerDay(
              calendars,
              calIDStr
            );
          }

          const minutesWorkedPerDay = this.calculateMinutesWorkBetweenDates(
            new Date(+shift.start),
            new Date(+shift.end)
          );
          const workedDays = Object.keys(minutesWorked);

          for (const day of workedDays) {
            timeLoggedPerDay[day] += minutesWorkedPerDay[day];
          }

          if (lastLogoutIsWork) {
            const offsiteMinutesWorked = this.calculateMinutesWorkBetweenDates(
              new Date(+shifts[ii - 1].end),
              new Date(+shift.start)
            );
            const offsiteWorked = Object.keys(offsiteMinutesWorked);
            for (const offsiteDay of offsiteWorked) {
              timeLoggedPerDay[offsiteDay] += offsiteMinutesWorked[offsiteDay];
            }
          }

          lastLogoutIsWork = shift.out_is_work_related === true;

          doCalcOvertime =
            doCalcOvertime &&
            (workedDays.length > 1 ||
              (ii > 0 &&
                DateFNGetDay(new Date(+shift.start)) !==
                  DateFNGetDay(new Date(+shifts[ii - 1].end))) ||
              (ii < shifts.length - 2 &&
                shift.calendarID !== shifts[ii + 1].calendarID));
        } else {
          lastLogoutIsWork = false;
          calIDStr = "";
        }

        if (ii === shifts.length - 1 || doCalcOvertime) {
          const dayKeys = Object.keys(timeLoggedPerDay);
          for (const dayKey of dayKeys) {
            if (+timeLoggedPerDay[dayKey] > 0) {
              const requiredTime = +calendarDayTimes[dayKey] || 0;
              const actualOvertime = +timeLoggedPerDay[dayKey] - requiredTime;

              if (!results[dayKey]) {
                results[dayKey] = 0;
              }
              results[dayKey] += actualOvertime;
            }
          }
        }
      }
    }

    return results;
  }

  calculateCalendarMinutesPerDay(calendars, calID) {
    const calWeeks = (calendars[calID] || {}).weeks || [];
    const calShifts = calWeeks.length ? (calWeeks[0] || {}).shifts || [] : [];

    const calDays = {};

    for (const shift of calShifts) {
      if (!calDays[`${shift.startDay}`]) {
        calDays[`${shift.startDay}`] = 0;
      }

      if (shift.spansSingleDay) {
        calDays[`${shift.startDay}`] +=
          +shift.endTime.split(":").join("") -
          +shift.startTime.split(":").join("");
      } else {
        let endDay = shift.endDay;
        if (shift.endDay < shift.startDay) {
          endDay += 7;
        }

        for (let ii = shift.startDay; ii <= endDay; ++ii) {
          const actualDay = ii % 7;
          let minutes = 0;
          if (ii === shift.startDay) {
            minutes = 2400 - +shift.startTime.split(":").join("");
          } else if (ii === shift.endDay) {
            minutes = +shift.endTime.split(":").join("");
          } else {
            minutes = 24 * 60;
          }
          calDays[`${actualDay}`] += minutes;
        }
      }
    }

    return calDays;
  }

  calculateMinutesWorkBetweenDates(startDate, endDate) {
    const shiftStartDay = DateFNGetDay(startDate);
    const shiftEndDay = DateFNGetDay(endDate);
    let numericalEndDay = shiftEndDay;

    minutesWorked = {};

    if (shiftStartDay === shiftEndDay) {
      minutesWorked[`${shiftStartDay}`] = DateFNDiffInMinutes(
        endDate,
        startDate
      );
    } else {
      if (shiftEndDay < shiftStartDay) {
        numericalEndDay += 7;
      }

      for (let jj = shiftStartDay; jj <= numericalEndDay; ++jj) {
        const actualDay = jj % 7;
        let minutes = 0;

        if (jj === shiftStartDay) {
          minutes = DateFNDiffInMinutes(DateFNEndOfDay(startDate), startDate);
        } else if (ii === shift.endDay) {
          minutes = DateFNDiffInMinutes(endDate, DateFNStartOfDay(endDate));
        } else {
          minutes = 24 * 60;
        }
        minutesWorked[`${actualDay}`] += minutes;
      }
    }

    return minutesWorked;
  }
}

module.exports = Reports;
