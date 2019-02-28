var mysqlPassword = require('../../../password.js');

//// manages connections for you
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  //host  : 'localhost',
  user            : 'cs340_duvallma',
  password        : `${mysqlPassword.mysqlPassword}`,
  database        : 'cs340_duvallma',
  dateStrings     : 'date'
});

module.exports.pool = pool;
