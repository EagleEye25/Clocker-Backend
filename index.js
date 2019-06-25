/* Load modules */
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
/* Database configuration */
const database = require('./app/config/dbconfig');

const whitelist = ['http://localhost'];
const corsOptions = {
	origin (origin, callback) {
		for (const url of whitelist){
			if (!origin || origin.startsWith(url)) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		}
	}
};

/* Init database */
database.init();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/* Init server listening */
const port = process.argv[2] || 3000;
app.listen(port, function () {
	console.log("Server listening on port : " + port);
});

/* Express configuration */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Router configuration */
const REST_API_ROOT = '/api';
app.use(REST_API_ROOT, require('./app/routes/router'));
