const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '172.17.0.2',
  user: 'root',
  password: 'root',
  database: 'node-complete-guide',
});

module.exports = pool.promise();
