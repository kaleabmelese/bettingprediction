var express = require("express");
var bodyParser = require("body-parser");
var rp = require("request-promise-native");
var { Client, Pool } = require("pg");
var pg_config = {
  user: "kalpsql",
  password: "kalpsql",
  host: "localhost",
  port: 5432,
  database: "db1"
};

var pool = new Pool(pg_config);
var PORT = process.env.PORT || 7000;

var app = express();
app.get("/", (req, res) => {
  res.status(200).json({
    message: "hi"
  });
});

app.get("/:id", (req, res) => {
  var param = req.params["id"];
  matcher = new RegExp(/\D+/g);
  if (matcher.test(param)) {
    res.status(400).json({
      message: `Illegal character in parameter id. Only numbers allowed`
    });
  } else {
    var query = {
      text: "select * from room where id=$1",
      values: [param]
    };
    pool
      .query(query)
      .then(result => {
        var message =
          result.rows.length === 0
            ? { message: `No record found for ${param}` }
            : result.rows;
        res.status(200).json(message);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err.message);
      });
  }
});

app.post("/:id", (req, res) => {
  var param = req.params["id"];
  matcher = new RegExp(/\D+/g);

  if (matcher.test(param)) {
    res.status(400).json({
      message: "invalid query"
    });
  } else {
    var query = {
      text: "delete from room where id=$1",
      values: [param]
    };

    pool
      .query(query)
      .then(result => {
        res.status(200).json({ message: "deleted successfully" });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err.message);
      });
  }
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

// CREATE TABLE user(id int primary key not null, first_name varchar(20) not null, last_name varchar(20) not null);
