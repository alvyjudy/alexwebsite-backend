module.exports = {
  checkIfEmailExists: (Connection, email) => {
    return new Promise (
      (resolve, reject) => {
        Connection.query(
          `SELECT email FROM Auth WHERE Api.Auth.email = ?`,
          [email],
          (err, results, fields) => {
            if (results[0]) {
              resolve('email exist'); //result[0].email is the email address string
            } else {
              reject('email not found');
            }
          }
        );
      },
    );
  },

  checkIfPwCorrect: (Connection, email, passphrase) => {
    return new Promise (
      (resolve, reject) => {
        Connection.query(
          `SELECT passphrase, userID FROM Api.Auth WHERE email = ?`,
          [email],
          (err, results, fields) => {
            if (results[0].passphrase === passphrase) {
              resolve(results[0].userID);
            } else {
              reject('passphrase incorrect');
            }
          }
        );
      }
    );
  },

  insertEmailPassphrase: (Connection, email, passphrase) => {
    return new Promise (
      (resolve, reject) => {
        Connection.query(`INSERT INTO Api.Auth (email, passphrase)
          VALUES (?, ?);`,
          [email, passphrase],
          (err, res, field) => {}
        );
        Connection.query(`SELECT userID FROM Api.Auth WHERE email = ?`,
          [email],
          (error, results, field) => {
            resolve(results[0].userID);
          })
      }
    );
  },

  addItemToCart: (Connection, itemFilename, userID, itemCount)=>{
    // Add a new item entry to the database and set its item count
    // note: each item per user has to be unique otherwise the database will
    // throw an exception. To change the count of the item, first remove it, then
    // add it again with the new count
    return new Promise (
      (resolve, reject) => {
        Connection.query(`INSERT INTO Api.Cart (itemFilename, userID, itemCount)
          VALUES (?, ?, ?);`,
          [itemFilename, userID, itemCount],
          (err, res, field) => {
            if (!err) {
              resolve('done');
            } else {
              reject(err);
            }
          }
        );
      }
    );

  },

  rmItemFromCart: (Connection, itemFilename, userID)=>{
    //Remove an item entry (not just the count) from the database
    return new Promise (
      (resolve, reject) => {
        Connection.query(`DELETE FROM Api.Cart
          WHERE itemFilename = ?
          AND userID = ?;`,
          [itemFilename, userID],
          (err, res, field) => {
            if (!err) {
              resolve('done');
            } else {
              reject(err);
            }
          }
        );
      }
    );
  },

  getUserCart:(Connection, userID)=>{
    //Get all items that's associated with a user ID in the Api.Cart
    //table. Returns a promise that resolves to an array of object that
    //contains three keys, itemFilename, userID and itemCount. The promise
    //reject to the err object returned by the query callback.
    return new Promise (
      (resolve, reject) => {
        Connection.query(`SELECT * FROM Api.Cart
          WHERE userID = ?`,
          [userID],
          (err, res, field) => {
            if (!err) {
            resolve(res);
            } else {
              reject(err);
            }
          }
        );
      }
    );
  }


}
