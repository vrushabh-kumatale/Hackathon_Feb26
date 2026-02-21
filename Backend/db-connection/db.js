const mysql = require("mysql2");
const { USERNAME, PASSWORD, DATABASE } = require("../config/index-template");

const pool = mysql.createPool({
  host: "localhost",
  user: 'root',
  password: 'manager',
  database: 'admission_management_db',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

module.exports = { pool };
