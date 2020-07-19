var express = require("express");
var path = require("path");
var mysql= require("mysql");
var sqlAction = require("./sqlAction.js");
var session = require("express-session");
var app = express();

var auth = {
  host: process.env.SQLHOST || 'localhost',
  user: process.env.SQLUSER || 'root',
  password: process.env.SQLPW || '12345678'
}

var sqlCon = mysql.createConnection(auth);
sqlCon.connect();
sqlCon.query(`USE Api;`);

app.use(session({
  secret:"development_secret",
  resave:true,
  saveUninitialized: true
}));

app.post("/api/login/",
  express.json(),
  (req, res) => {
    var email = req.body.email;
    var passphrase = req.body.passphrase;
    sqlAction.checkIfEmailExists(sqlCon, email)
      .then(
        (result) => {return sqlAction.checkIfPwCorrect(sqlCon, email, passphrase)}
      )
      .then((value) => {
        req.session.user=value;
        res.status(200).send(
          {'authenticated': true
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
          req.session.user = value;
          console.log('value', value);
          res.status(200).send(
            {'authenticated': true,
            'message': 'new user registered'}
          );
        },
        console.log
      )
  }
);

app.get('/api/session',
  (req, res) => {
    if (req.session.user) {
      res.send("logged in");
    } else {
      res.send("logged out");
    }
  }
);

app.post('/api/logout',
  (req, res) => {
    req.session.destroy(()=>{res.send('loggedout')});
  }
)



app.listen(process.env.PORT || 3002);
