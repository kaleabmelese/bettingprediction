const environment = process.env.NODE_ENV || "development"; // set environment
const configuration = require("../knexfile")[environment]; // pull in correct db with env configs
const database = require("knex")(configuration); // define database based on above
const bcrypt = require("bcryptjs"); // bcrypt will encrypt passwords to be saved in db
const crypto = require("crypto"); // built-in encryption node module
const dbexec = require("../database/dbexec")

const stuff = (module.exports = {
  hashPassword: password => {
    return new Promise((resolve, reject) =>
      bcrypt.hash(password, 10, (err, hash) => {
        err ? reject(err) : resolve(hash);
      })
    );
  },

  createUser: user => {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO users (username, password_digest, token, created_at) VALUES (?, ?, ?, ?) RETURNING username, created_at, token";
      const arr = [user.username, user.password_digest, user.token, new Date()]
      dbexec.dataquery(query, arr).then(data => {
        resolve(data[0])
      }).catch(err => {
        reject(err)
      })
    })
  },
  deleteUser: user => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM users WHERE username='${user.username}'`;
      const username = user.username;

      dbexec.onlyquery(query).then(result => {
        if (result.length === 0) {
          resolve({
            message: `USER_${username}_SIGN_OUT SUCCESS`,
            data: result.length
          });
        } else {
          resolve({ message: "server error", data: "undefined" });
        }
      })
        .catch(err => {
          reject({ message: "signout error", data: err });
        });
    })
  },

  // crypto used to create a random, secure token
  createToken: () => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, data) => {
        err ? reject(err) : resolve(data.toString("base64"));
      });
    });
  },

  findUser: userReq => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE username='${userReq.username}'`;
      database.raw(query).then(result => {
        if (result.rows.length === 0) {
          resolve({ message: "user not found", data: result.rows.length });
        } else {
          resolve({ message: "user found", data: result.rows[0] });
        }
      });
    });
  },

  checkPassword: (reqPassword, foundUser) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(
        reqPassword,
        foundUser.password_digest,
        (err, response) => {
          if (err) {
            reject({ err });

          } else if (response) {
            resolve(response);
          } else {
            reject(new Error("Passwords do not match."));
          }
        }
      )
    });
  },

  updateUserToken: (token, user) => {
    return database
      .raw(
        "UPDATE users SET token = ? WHERE id = ? RETURNING id, username, token",
        [token, user.id]
      )
      .then(data => data.rows[0]);
  },
});
