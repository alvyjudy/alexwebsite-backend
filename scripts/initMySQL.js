require('dotenv').config();
var mysql= require("mysql");

var con = mysql.createConnection(
  {
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PW || '12345678'
  }
);

con.connect()
