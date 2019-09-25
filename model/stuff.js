const environment = process.env.NODE_ENV || "development"; // set environment
const configuration = require("../knexfile")[environment]; // pull in correct db with env configs
const database = require("knex")(configuration); // define database based on above
const bcrypt = require("bcrypt"); // bcrypt will encrypt passwords to be saved in db
const crypto = require("crypto"); // built-in encryption node module
const Pool = require("pg").Pool;
const stuff = (module.exports = {
  // check out bcrypt's docs for more info on their hashing function
  hashPassword: password => {
    return new Promise((resolve, reject) =>
      bcrypt.hash(password, 10, (err, hash) => {
        err ? reject(err) : resolve(hash);
      })
    );
  },

  // user will be saved to db - we're explicitly asking postgres to return back helpful info from the row created
  createUser: user => {
    return database
      .raw(
        "INSERT INTO users (username, password_digest, token, created_at) VALUES (?, ?, ?, ?) RETURNING id, username, created_at, token",
        [user.username, user.password_digest, user.token, new Date()]
      )
      .then(data => data.rows[0]);
  },

  // crypto ships with node - we're leveraging it to create a random, secure token
  createToken: () => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, data) => {
        err ? reject(err) : resolve(data.toString("base64"));
      });
    });
  },

  findUser: userReq => {
    return database
      .raw("SELECT * FROM users WHERE username = ?", [userReq.username])
      .then(data => data.rows[0]);
  },

  checkPassword: (reqPassword, foundUser) => {
    return new Promise((resolve, reject) =>
      bcrypt.compare(
        reqPassword,
        foundUser.password_digest,
        (err, response) => {
          if (err) {
            reject(err);
          } else if (response) {
            resolve(response);
          } else {
            reject(new Error("Passwords do not match."));
          }
        }
      )
    );
  },

  updateUserToken: (token, user) => {
    return database
      .raw(
        "UPDATE users SET token = ? WHERE id = ? RETURNING id, username, token",
        [token, user.id]
      )
      .then(data => data.rows[0]);
  },
  savePrediction: pbody => {
    return new Promise((resolve, reject) => {
      const fixtures = pbody.fixture;
      if (fixtures.length === 0) {
        resolve({
          status: "DATA_TO_SMALL_TO_PROCESS",
          message: "You need to provide at least one data",
          input_data_size: 0,
          data: []
        });
      } else if (fixtures.length <= 50) {
        var query = `INSERT INTO predictions(league,team1,team2,tip,matchtime,inserted_at) VALUES`;
        fixtures.forEach(element => {
          query += `('${pbody.league}','${element.team1}','${element.team2}','${
            element.tip
          }',
                  '${element.matchtime}','${new Date()
            .toISOString()
            .slice(0, 10)}'),`;
        }, query);
        query = query.substring(0, query.lastIndexOf(",")) + " returning *;";
        database
          .raw(query)
          .then(result => {
            console.log(result.rows);
            resolve({
              status: "DATA_IMPORT_SUCCESS",
              message: "Successfully created predictions",
              input_data_size: fixtures.length,
              data: result.rows
            });
          })
          .catch(err => {
            reject(err);
          });
      } else {
        resolve({
          status: "DATA_TO_LARGE_TO_PROCESS",
          message: "Split your data into smaller chunks",
          input_data_size: fixtures.length,
          data: []
        });
      }
    });
  },
  fetchprediction: pbody => {
    const matchtime = pbody.matchtime;
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM predictions WHERE matchtime='${matchtime}'`;
      database.raw(query).then(result => {
        resolve({
          status: "NO_ERROR",
          message: "Request correct",
          data: result.rows
        });
      });
    });

    // return database
    //   .raw("SELECT * FROM predictions WHERE matchtime=?", [pbody.matchtime]) //match time is manuall only for the trial
    //   .then(data => data.rows)
    //   .catch(err => {
    //     response.status(404).json({ message: "not found" });
    //   });
  }
});
