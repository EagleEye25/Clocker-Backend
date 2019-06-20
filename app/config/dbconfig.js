/* Load modules */
let sqlite3 = require('sqlite3').verbose();

/*
 * Database configuration
 */

/* Load database file (Creates file if not exists) */
let db = new sqlite3.Database('./clocker.db');

/* Init car and driver tables if they don't exist */
let init = function () {

	// db.run("DROP TABLE IF EXISTS employee");
	// db.run("DROP TABLE IF EXISTS reason");
	// db.run("DROP TABLE IF EXISTS clocking");
	// db.run("DROP TABLE IF EXISTS employee_calender");
	// db.run("DROP TABLE IF EXISTS calender");
	// db.run("DROP TABLE IF EXISTS calender_times");
	// db.run("DROP TABLE IF EXISTS card");
	// db.run("DROP TABLE IF EXISTS employee_card");
	// db.run("DROP TABLE IF EXISTS token");

	db.run("CREATE TABLE if not exists reason (" +
		" id INTEGER PRIMARY KEY AUTOINCREMENT," +
		" description TEXT," +
		" work BOOL" +
		")"
	);

	db.run("CREATE TABLE if not exists token (" +
		" id INTEGER PRIMARY KEY AUTOINCREMENT," +
		" token TEXT" +
		")"
	);

	db.run(`CREATE TABLE if not exists card (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		card_no TEXT);
		CREATE INDEX card_no ON card(card_no);`
	);

	db.run("CREATE TABLE if not exists calender (" +
		" id INTEGER PRIMARY KEY AUTOINCREMENT," +
		" name STRING," +
		" description STRING" +
		")"
	);

	db.run("CREATE TABLE if not exists employee (" +
		" id INTEGER PRIMARY KEY AUTOINCREMENT," +
		" name TEXT," +
		" admin BOOL," +
		" reporting_admin BOOL," +
		" password STRING," +
		" calender_id INTEGER," +
		" FOREIGN KEY(calender_id) REFERENCES calender(id)" +
		")"
	);

	db.run("CREATE TABLE if not exists employee_calender (" +
		" id INTEGER PRIMARY KEY AUTOINCREMENT," +
		" active_date DATETIME," +
		" employee_id INTEGER," +
		" calender_id INTEGER," +
		" FOREIGN KEY(employee_id) REFERENCES employee(id)," +
		" FOREIGN KEY(calender_id) REFERENCES calender(id)" +
		")"
	);

	db.run("CREATE TABLE if not exists calender_times (" +
		" id INTEGER PRIMARY KEY AUTOINCREMENT," +
		" calender_id INTEGER," +
		" start DATETIME," +
		" end DATETIME," +
		" FOREIGN KEY(calender_id) REFERENCES calender(id)" +
		")"
	);

	db.run("CREATE TABLE if not exists employee_card (" +
		" id INTEGER PRIMARY KEY AUTOINCREMENT," +
		" employee_id INTEGER," +
		" card_id INTEGER," +
		" issed_at DATETIME," +
		" active BOOL," +
		" FOREIGN KEY(employee_id) REFERENCES employee(id)," +
		" FOREIGN KEY(card_id) REFERENCES card(id)" +
		")"
	);

	db.run("CREATE TABLE if not exists clocking (" +
		" id INTEGER PRIMARY KEY AUTOINCREMENT," +
		" employee_id INTEGER," +
		" reason_id INTEGER," +
		" clock_in DATETIME," +
		" clock_out DATETIME," +
		" overtime DATETIME," +
		" FOREIGN KEY(employee_id) REFERENCES employee(id)," +
		" FOREIGN KEY(reason_id) REFERENCES reason(id)" +
		")"
	);
};

module.exports = {
	init: init,
	db: db
};

