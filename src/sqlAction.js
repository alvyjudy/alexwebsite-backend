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
          `SELECT passphrase, userID FROM Auth WHERE email = ?`,
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
        Connection.query(`SELECT userID FROM Auth WHERE email = ?`,
          [email],
          (error, results, field) => {
            resolve(results[0].userID);
          })
      }
    );
  },

  addItemToCart: (Connection, itemFilename, userID)=>{
    return new Promise (
      (resolve, reject) => {
        Connection.query(`INSERT INTO Api.Cart (itemFilename, userID)
          VALUES (?, ?);`,
          [itemFilename, userID],
          (err, res, field) => {
            if (!err) {
              resolve('done');
            } else {
              reject(err);
            }
          }
        )
      }
    );

  },

  rmItemFromCart:()=>{},

  getUserCart:()=>{},


}
