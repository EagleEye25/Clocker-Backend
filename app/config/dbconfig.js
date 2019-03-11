/* Load modules */
let sqlite3 = require('sqlite3').verbose();

/*
 * Database configuration
 */

/* Load database file (Creates file if not exists) */
let db = new sqlite3.Database('./clocker.db');

/* Init car and driver tables if they don't exist */
let init = function () {

	db.run("CREATE TABLE if not exists car (" +
		"id INTEGER PRIMARY KEY AUTOINCREMENT," +
		" maker TEXT," +
		" model TEXT," +
		" year INT," +
		" driver INT" +
		")"
	);

	db.run("CREATE TABLE if not exists employee (" +
		"id INTEGER PRIMARY KEY AUTOINCREMENT," +
		" name TEXT," +
		" surName TEXT," +
		" empID INT," +
		" phone INT," +
		" email TEXT," +
		" department TEXT," +
		" tagID INT" +
		")"
	);
};

module.exports = {
	init: init,
	db: db
};

