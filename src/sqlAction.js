module.exports = {
  checkIfEmailExists: (Connection, res, email) => {
    return new Promise (
      (resolve, reject) => {
        Connection.query(
          `SELECT email FROM Api.user WHERE Api.user.email = ?`,
          [email],
          (err, results, fields) => {

            if (results[0]) {
              resolve(Cresults[0].email); //result[0].email is the email address string
            } else {
              reject('email not found');
            }
          }
        );
      },
    );
  },

  checkIfPwCorrect: (Connection, email, pw) => {
    return new Promise (
      (resolve, reject) => {
        Connection.query(
          `SELECT pw FROM Api.user`,
          (err, results, fields) => {
            if (results[0].pw === pw) {
              resolve('password correct');
            } else {
              reject('password incorrect');
            }
          }
        );
      }
    );
  },

  insertEmailPw: (Connection, username, pw) => {
    Connection.query(`INSERT INTO Api.user (email, pw)
    VALUES (?, ?);`,
    [username, pw]
    );
  }
}
