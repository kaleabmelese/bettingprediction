// const { Client } = require("pg");
// //const info = "postgressql://postgres:@localhost:5432/kaldb";
// const client = new Client({
//   user: "Admin1",
//   database: "postgres",
//   password: "pass"
// });
// // client.user = "postgres";

// client.connect();
// client.query("SELECT $1::text as message", ["Hello world!"], (err, res) => {
//   console.log(err ? err.stack : res.rows[0].message); // Hello World!
//   client.end();
// });
// // console.log(Object.keys(client.password));

const { Pool, Client } = require("pg");
const connectionString = "postgres://kaleab@localhost:5432/testdb";
const pool = new Pool({
  connectionString: connectionString
});
pool.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  pool.end();
});
const client = new Client({
  connectionString: connectionString
});
client.connect();
client.query("SELECT NOW()", (err, res) => {
  console.log(err, res);
  client.end();
});
