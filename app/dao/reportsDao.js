/* Load Employee entity */
const employee = require('../model/employee');

const daoCommon = require('./commons/daoCommon');

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
	};

}

module.exports = Reports;