const express = require("express");
const path = require("path");
const mysql= require("mysql");

const app = express();

const auth = {
  host: process.env.SQLHOST || 'localhost',
  user: process.env.SQLUSER || 'root',
  password: process.env.SQLPW || '12345678'
}

let sqlCon = mysql.createConnection(auth);
sqlCon.connect();


app.get("/api/", (req, res) => {
  res.send("hello");
});

app.post('/api/register',
  express.json(),
  async (req, res) => {
    let username = req.body.username;
    let pw = req.body.password;
    sqlCon.query(`INSERT INTO Api.user (email, pw)
      VALUES (?, ?);`,
      [username, pw],
      () => {
        res.send("done");
      }
    );
  }
);

app.listen(process.env.PORT || 3002);
