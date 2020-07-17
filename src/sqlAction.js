module.exports = {
  checkIfEmailExists: (Connection, email) => {
    return new Promise (
      (resolve, reject) => {
        Connection.query(
          `SELECT email FROM Auth WHERE Api.Auth.email = ?`,
          [email],
          (err, results, fields) => {
            if (results[0]) {
              resolve(results[0].email); //result[0].email is the email address string
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
              console.log(results);
              resolve(results[0].userID);
            } else {
              reject('passphrase incorrect');
            }
          }
        );
      }
    );
  },

  insertEmailPw: (Connection, email, passphrase) => {
    Connection.query(`INSERT INTO Api.user (email, passphrase)
    VALUES (?, ?);`,
    [email, passphrase]
    );
  }
}
