/* Load Employee entity */
const employee = require("../model/employee");

const daoCommon = require("./commons/daoCommon");

/**
 * REPORTS Data Access Object
 */
class Reports {
  constructor() {
    this.common = new daoCommon();
  }

  /**
   * Updates the given entity in the database
   * @params Employee
   * @return true if the entity has been updated, false if not found and not updated
   */
  async getUsersInAndOut() {
    let sqlRequest = `
    SELECT *
    FROM	(
          -- logged out
          SELECT	e.*,
              1 AS is_logged_out,
              COALESCE(r.description, 'UNKNOWN') as reason_description,
              r.work as work_related_reason
          FROM	(
                SELECT	DISTINCT(c.employee_id),
                    c.id,
                    c.reason_id,
                    max(c.clock_out)
                FROM	clocking c
                WHERE	c.clock_out IS NOT NULL
                GROUP BY c.employee_id
              ) logged_out
              INNER JOIN	employee e
              ON			e.id = logged_out.employee_id
              LEFT JOIN	reason r
              ON			r.id = logged_out.reason_id
          WHERE logged_out.employee_id NOT IN (
            SELECT	DISTINCT(c.employee_id)
            FROM	clocking c
            WHERE	c.clock_out IS NULL
          )
          AND e.active = 1

          UNION

          -- logged in
          SELECT	e.*,
              0 AS is_logged_out,
              '' as reason_description,
              0 as work_related_reason
          FROM	(
                SELECT	DISTINCT(c.employee_id),
                    c.id,
                    max(c.clock_in)
                FROM	clocking c
                WHERE	c.clock_out IS NULL
                GROUP BY c.employee_id
              ) logged_in
              INNER JOIN	employee e
              ON			e.id = logged_in.employee_id
          WHERE	e.active = 1
        )
    ORDER BY is_logged_out DESC
    `;
    const rows = await this.common.findAll(sqlRequest);
    let employees = [];
    for (const row of rows) {
      employees.push(row);
    }
    return employees;
  }

  fetchReportCalendars(empIds, end) {
    let filterByEmp = "";
    if (empIds.length) {
      filterByEmp = "AND employee_id IN ($empIds)";
    }
    let sqlRequest = `

      SELECT  c.id
              ,c.name
              ,ct.startWeek
              ,ct.startDay
              ,ct.startTime
              ,ct.endDay
              ,ct.endTime
      FROM    calender c
              INNER JOIN  calender_times ct
              ON          ct.calender_id = c.id
      WHERE   c.id IN (
                SELECT  DISTINCT calender_id
                FROM    employee_calender
                WHERE   active_date <= $end
                ${filterByEmp}
              )
      ORDER BY c.id, ct.startWeek, ct.startDay, ct.startTime
      ;
    `;

    let sqlParams = {
      $end: end
    };

    if (empIds.length) {
      sqlParams["$empIds"] = empIds;
    }

    return this.common.findMany(sqlRequest, sqlParams);
  }

  fetchReportEmployeeCalendars(end, empIds, calIds) {
    let filterByEmp = "";
    let filterByCal = "";
    if (empIds.length) {
      filterByEmp = "AND ec.employee_id IN ($empIds)";
    }
    if (empIds.length) {
      calIds = "AND ec.calender_id IN ($calIds)";
    }

    let sqlRequest = `
      SELECT  *
      FROM    employee_calender ec
      WHERE   ec.active_date <= $end
      ${filterByEmp}
      ${filterByCal}
      ORDER BY ec.employee_id, ec.active_date
      ;
    `;

    let sqlParams = {
      $end: end
    };

    if (empIds.length) {
      sqlParams["$empIds"] = empIds;
    }

    if (calIds.length) {
      sqlParams["$calIds"] = calIds;
    }

    return this.common.findMany(sqlRequest, sqlParams);
  }

  fetchReportEmployeeTimes(start, end, empIds) {
    let filterByEmp = "";
    if (empIds.length) {
      filterByEmp = "AND e.id IN ($empIds)";
    }

    let sqlRequest = `
      SELECT  e.id employee_id
              , e.name employee_name
              , c.clock_in
              , c.clock_out
              , r.description reason_description
              , r.work work_related
      FROM    clocking c
              INNER JOIN  employee e
              ON          e.id = c.employee_id
              ${filterByEmp}
              LEFT JOIN   reason r
              ON          r.id = c.reason_id
      WHERE   c.clock_in <= $end
      AND     (CASE WHEN c.clock_out IS NULL THEN 1 ELSE c.clock_out END >= $start)
      ORDER BY e.id, c.clock_in
      ;
    `;

    let sqlParams = {
      $start: start,
      $end: end
    };

    if (empIds.length) {
      sqlParams["$empIds"] = empIds;
    }

    return this.common.findMany(sqlRequest, sqlParams);
  }
}

module.exports = Reports;
