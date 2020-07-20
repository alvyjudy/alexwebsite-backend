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

//Get all items the current authenticated user has that's
//added to shopping cart. Return the response in the body
//as a json array of object each comprised of 2 keys:
//itemFilename, count
var authenticate = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.status(401).send("unauthenticated");
  }
};

app.get("/api/cart",
  authenticate,
  (req, res) => {
    sqlAction.getUserCart(sqlCon, req.session.user)
    .then(
      (value) => {
        var jsonStr = JSON.stringify(value);
        res.status(200).send(jsonStr);
      }
    );
  }
);

//manipulate the items added to cart by the authenticated
//user. The request body defines a JSON object with three
//keys: action, toRemove, toAdd.
//toRemove and toAdd are two arrays of objects each of which
//specifying an item to be added to the cart. The item
//has two keys, itemFilename and itemCount
app.post("/api/cart",
  express.json(),
  authenticate,
  (req, res) => {
    var toRemove = req.body.toRemove;
    var toAdd = req.body.toAdd;

    if (toRemove && toRemove.length !== 0) {
      toRemove.forEach(
        (item) => {
          sqlAction.rmItemFromCart(sqlCon, item.itemFilename,
            req.session.user).then(console.log).catch(console.log);
        }
      );
    }

    if (toAdd && toAdd.length !== 0) {
      toAdd.forEach(
        (item) => {
          if (item) {
            sqlAction.addItemToCart(sqlCon, item.itemFilename,
              req.session.user, item.itemCount).then(console.log)
              .catch(console.log);
          }
        }
      );
    }
    res.status(200).send('request received');
  }
);


app.listen(process.env.PORT || 3002);
