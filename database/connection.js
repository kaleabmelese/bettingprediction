var { Client, Pool } = require("pg");
const pg_configer = {
  user: "kalpsql",
  password: "kalpsql",
  host: "localhost",
  port: 5432,
  database: "bettbase"
};

var pool = new Pool(pg_configer);

var self = (module.exports = {
  fetch: (req, res) => {
    const query = "select * from client";
    return new Promise((resolve, reject) => {
      pool
        .query(query)
        .then(result => {
          const message = result.rows;
          var content = result.rows.length;
          if (content === 0) {
            console.log(err => {
              JSON({
                message: "no record found"
              });
            });
          } else {
            // console.log(message);
            resolve(message);
          }
        })
        .catch(err => {
          reject(err);
          // console.log(err);
        });
    });
  },
  insert: (fname, lname) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO client(fname, lname) values ($1,$2) RETURNING *`;

      pool
        // .query("insert into client (fname,lname) values ($1,$2)", [//also posible
        .query(query, [fname, lname])
        .then(result => {
          console.log("added success");
          resolve(result.rows);
        })
        .catch(err => {
          console.log("error", err);
        });
    });
  }
});
