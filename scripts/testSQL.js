function main (){

  var mysql= require("mysql");
  var sqlAction = require("../src/sqlAction.js");
  var checkEmailPromise;

  var con = mysql.createConnection(
    {
      host: process.env.SQLHOST || 'localhost',
      user: process.env.SQLUSER || 'root',
      password: process.env.SQLPW || '12345678'
    }
  );

  con.connect();
  sqlAction.checkIfEmailExists(con, undefined, 'alvyjudy@gmail.com', '12345')
    .then(
      (result) => {return sqlAction.checkIfPwCorrect(con, result, '123435')}
    )
    .then(console.log)
    .catch(console.log)


}

main();


/*
con.query("SELECT email from Api.user WHERE email = ?;",
  ['alvyjudy@gmail.com'],
  (err, res, fie) => {
    if (res[0]) {
      console.log(res[0].email);
    }
  }
)

con.query("select pw from Api.user where Api.user.email=?", ['alvyjudy@gmail.com'],
  (err, res, f)=>{
    console.log(res);
  })
*/
