'use strict';
const mysql = require('mysql');
//local mysql db connection
const dbConn = mysql.createConnection({
  host: process.env.HOST_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE_NAME
});

dbConn.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});

module.exports = dbConn;