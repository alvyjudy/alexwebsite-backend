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

  con.query(`
    CREATE TABLE Auth (
      userID int NOT NULL AUTO_INCREMENT PRIMARY KEY,
      email varchar(255) NOT NULL UNIQUE,
      passphrase varchar(255) NOT NULL
    );`);

  con.query(`
    CREATE TABLE Cart (
      itemFilename varchar(255) NOT NULL,
      userID int NOT NULL,
      itemCount int NOT NULL,
      FOREIGN KEY (userID) REFERENCES Auth(userID),
      UNIQUE KEY (itemFilename, userID)
    );
  `);

  con.query(`
    CREATE TABLE Orders (
      orderID int NOT NULL UNIQUE AUTO_INCREMENT,
      userID int NOT NULL,
      PRIMARY KEY (orderID),
      FOREIGN KEY (userID) REFERENCES Auth(userID)
    );
    `);

  con.query(`
    CREATE TABLE CheckedOutItems (
      itemFilename varchar(255) NOT NULL,
      orderID int NOT NULL,
      itemCount int NOT NULL,
      FOREIGN KEY (orderID) REFERENCES Orders(orderID),
      UNIQUE KEY (itemFilename, orderID)
    );
    `);



  con.end();
}

init();
