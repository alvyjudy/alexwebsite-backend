require('dotenv').config();
var mysql= require("mysql");



var con = mysql.createConnection(
  {
    host: process.env.SQLHOST || 'localhost',
    user: process.env.SQLUSER || 'root',
    password: process.env.SQLPW || '12345678'
  }
);

let init = () => {
  con.connect();
  con.query("DROP DATABASE IF EXISTS Api;");
  con.query("CREATE DATABASE Api;");
  con.query("USE Api;");
  con.query("CREATE TABLE user (email varchar(255), pw varchar(255));");
  con.end();
}

init();
