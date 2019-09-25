var { Client, Pool } = require("pg");

var pg_config = {
  user: "kalpsql",
  password: "kalpsql",
  host: "localhost",
  port: 5432,
  database: "bettbase"
};

var pool = new Pool(pg_config);

var query_select = "select * from client";
var query_delete = "delete from client where id='1'";

pool
  .query(query_select)
  .then(result => {
    if (result.rows.length === 0) {
      console.log("record not found");
    } else {
      console.log(result.rows);
    }
  })
  .catch(err => {
    console.log(JSON.stringify(err));
  });

pool.query(query_delete).then(() => {
  var query_check = "select * from client where id='1'";
  var val = pool.query(query_check);
});
