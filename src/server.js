var express = require("express");
var path = require("path");
var mysql= require("mysql");
var sqlAction = require("./sqlAction.js");
var app = express();

var auth = {
  host: process.env.SQLHOST || 'localhost',
  user: process.env.SQLUSER || 'root',
  password: process.env.SQLPW || '12345678'
}

var sqlCon = mysql.createConnection(auth);
sqlCon.connect();
sqlCon.query(`USE Api;`);


app.post("/api/login/",
  express.json(),
  (req, res) => {
    var email = req.body.email;
    var passphrase = req.body.passphrase;
    sqlAction.checkIfEmailExists(sqlCon, email)
      .then(
        (result) => {return sqlAction.checkIfPwCorrect(sqlCon, email, passphrase)}
      )
      .then((value) => {res.status(200).send(
        {'authenticated': true,
          'userID': value
        });
      })
      .catch((value) => {
        res.status(401).send(
          {'authenticated': false,
        'message': 'password incorrect'}
        )
      });
  }
);

app.post('/api/register',
  express.json(),
  (req, res) => {
    var email = req.body.email;
    var passphrase = req.body.passphrase;
    var Register = sqlAction.checkIfEmailExists(sqlCon, email)
      .then(
        (value) => {
          res.status(400).send("email already registered");
          return new Promise((res, rej)=> {rej('already registered');});
        },
        (value) => {
          return sqlAction.insertEmailPassphrase(sqlCon, email, passphrase);
        }
      )
      .then(
        (value) => {
          res.status(200).send(
            {'authenticated': true,
            'message': 'new user registered'}
          );
        }
      )
      .catch(console.log)


/*
      .then(

      )
      .catch(
        (value) => {
          console.log("hello");
          res.status(400).send("error");
        }
      );
*/
  }
);

app.post("/api/items", //
  express.json(),
  (req, res) => {}
);

app.get("/api/items");


app.listen(process.env.PORT || 3002);
