require('dotenv').config();
var mysql= require("mysql");



var con = mysql.createConnection(
  {
    host: process.env.SQLHOST || 'localhost',
    user: process.env.SQLUSER || 'root',
    password: process.env.SQLPW || '12345678'
  }
);

let init = async () => {
  await con.connect();
  await con.query("DROP DATABASE IF EXISTS Api;");
  await con.query("CREATE DATABASE Api;");
  await con.query("USE Api;");
  await con.query("CREATE TABLE user (email varchar(255), pw varchar(255));");
  con.end();
}

init();
