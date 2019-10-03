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
  deleteUser: user => {
    // const usrname = user;
    // console.log(usrname.username);
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM users WHERE username='${user.username}'`;
      console.log(user.username);
      const username = user.username;
      database
        .raw(query)
        .then(result => {
          if (result.rows.length === 0) {
            resolve({
              message: `USER_${username}_SIGN_OUT SUCCESS`,
              data: result.rows.length
            });
          } else {
            resolve({ message: "server error", data: "undefined" });
          }
        })
        .catch(err => {
          reject({ message: "signout error", data: err });
          // reject(err);
        });
    });
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
    // return database
    //   .raw("SELECT * FROM users WHERE username = ?", [userReq.username])
    //   .then(data => data.rows[0]);
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
      const matchinfo = pbody;
      const query =
        "INSERT INTO predictions(league,team1,team2,tip,matchtime,inserted_at) VALUES(?,?,?,?,?,?) RETURNING *";
      database
        .raw(query, [
          matchinfo.league,
          matchinfo.team1,
          matchinfo.team2,
          matchinfo.tip,
          matchinfo.matchtime,
          new Date()
        ])
        .then(result => {
          if (result.rows.length === 0) {
            resolve({ message: "data is not inserted" });
          } else if (result.rows.length > 1) {
            resolve({
              message: "data too large to process",
              data: result.rows.length
            });
          } else {
            resolve({ message: "POST_SUCCESS", data: result.rows });
          }
        });
    });

    // return new Promise((resolve, reject) => {
    //   const fixtures = pbody.fixture;
    //   if (fixtures.length === 0) {
    //     resolve({
    //       status: "DATA_TO_SMALL_TO_PROCESS",
    //       message: "You need to provide at least one data",
    //       input_data_size: 0,
    //       data: []
    //     });
    //   } else if (fixtures.length <= 5) {
    //     var query = `INSERT INTO predictions(league,team1,team2,tip,matchtime,inserted_at) VALUES`;
    //     fixtures.forEach(element => {
    //       query += `('${pbody.league}','${element.team1}','${element.team2}',
    //       '${element.tip}','${
    //         element.matchtime
    //       }','${new Date().toISOString().slice(0, 9)}'),`;
    //     }, query);
    //     query = query.substring(0, query.lastIndexOf(",")) + " returning *;";
    //     database
    //       .raw(query)
    //       .then(result => {
    //         console.log(result.rows);
    //         resolve({
    //           status: "DATA_IMPORT_SUCCESS",
    //           message: "Successfully created predictions",
    //           input_data_size: fixtures.length,
    //           data: result.rows
    //         });
    //       })
    //       .catch(err => {
    //         reject(err);
    //       });
    //   } else {
    //     resolve({
    //       status: "DATA_TO_LARGE_TO_PROCESS",
    //       message: "Split your data into smaller chunks",
    //       input_data_size: fixtures.length,
    //       data: []
    //     });
    //   }
    // });
  },
  fetchprediction: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM predictions`;
      database
        .raw(query)
        .then(result => {
          if (result.rows.length === 0) {
            resolve({
              status: "No error",
              message: "there are no predictions",
              data: result.rows.length
            });
          } else {
            resolve({
              status: "NO_ERROR",
              message: "Request correct",
              data: result.rows
            });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  savefreetip: pbody => {
    return new Promise((resolve, reject) => {
      const tipinfo = pbody;
      const query =
        "INSERT INTO freetips(league,team1,team2,tip,matchtime,inserted_at) VALUES (?,?,?,?,?,?) RETURNING *";
      database
        .raw(query, [
          tipinfo.league,
          tipinfo.team1,
          tipinfo.team2,
          tipinfo.tip,
          tipinfo.matchtime,
          new Date()
        ])
        .then(result => {
          if (result.rows.length === 0) {
            resolve({
              message: "there are no free tips for today",
              data: result.rows.length
            });
          } else {
            resolve({
              message: "tips of the day",
              data: result.rows
            });
          }
        })
        .catch(err => {
          reject(err);
        });
      // if (fixtures.length === 0) {
      //   resolve({
      //     status: "DATA_TO_SMALL_TO_PROCESS",
      //     message: "You need to provide at least one data",
      //     input_data_size: 0,
      //     data: []
      //   });
      // } else if (fixtures.length <= 5) {
      //   var query = `INSERT INTO freetips(league,team1,team2,tip,matchtime,inserted_at) VALUES`;
      //   fixtures.forEach(element => {
      //     query += `('${pbody.league}','${element.team1}','${element.team2}',
      //     '${element.tip}','${
      //       element.matchtime
      //     }','${new Date().toISOString().slice(0, 10)}'),`;
      //   }, query);
      //   query = query.substring(0, query.lastIndexOf(",")) + " returning *;";
      //   database
      //     .raw(query)
      //     .then(result => {
      //       console.log(result.rows);
      //       resolve({
      //         status: "DATA_IMPORT_SUCCESS",
      //         message: "Successfully created freetips",
      //         input_data_size: fixtures.length,
      //         data: result.rows
      //       });
      //     })
      //     .catch(err => {
      //       reject(err);
      //     });
      // } else {
      //   resolve({
      //     status: "DATA_TO_LARGE_TO_PROCESS",
      //     message: "maximum data list number is 5",
      //     input_data_size: fixtures.length,
      //     data: []
      //   });
      // }
    });
  },
  fetchfreetip: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM freetips`;
      database
        .raw(query)
        .then(result => {
          if (result.rows.length === 0) {
            resolve({
              message: "THERE_ARE_NO_FREE_TIPS_FOR_TODAY",
              data: []
            });
          } else if (result === null) {
            resolve({
              message: "BAD_RESPONSE",
              data: null
            });
          } else {
            resolve({
              message: "FETCHED_FREE_TIP",
              data: result.rows
            });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  deleteprediction: () => {
    return new Promise((resolve, reject) => {
      const query = "delete from predictions";
      database
        .raw(query)
        .then(result => {
          if (result.rows.length === 0) {
            resolve({
              message: "predictions deleted successfully",
              data: 0
            });
          } else {
            resolve({
              message: "request not correct",
              data: "undefined"
            });
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  package: pkgbody => {
    //pkgtype 1=>daily package, 2=>weekly, 3=>monthly, 4=>semi annual and 5=>annual
    return new Promise((resolve, reject) => {
      if (pkgbody.pkgtype === 1) {
        const day = new Date();
        var today =
          day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
        const query = `SELECT * FROM predictions WHERE matchtime='${today}'`;
        database
          .raw(query)
          .then(result => {
            if (result.rows.length === 0) {
              resolve({
                message: "there are no tips for today",
                data: result.rows
              });
            } else if (result.rows.length <= 50) {
              resolve({ message: "tips provided", data: result.rows });
            } else {
              resolve({
                message: "data is too large",
                data: "length" + result.rows.length
              });
            }
          })
          .catch(err => {
            reject(err);
          });
      } else if (pkgbody.pkgtype === 2) {
        const day = new Date();
        const today =
          day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
        const date1 = day.setDate(day.getDate() + 1);
        const date2 = day.setDate(day.getDate() + 2);
        const date3 = day.setDate(day.getDate() + 3);
        const date4 = day.setDate(day.getDate() + 4);
        const date5 = day.setDate(day.getDate() + 5);
        const date6 = day.setDate(day.getDate() + 6);
        const date7 = day.setDate(day.getDate() + 7);

        const query = `SELECT * FROM predictions WHERE matchtime='${today}' OR matchtime='${date1}'
         OR matchtime='${date2}'OR matchtime='${date3}' OR matchtime='${date4}' OR matchtime='${date5}' OR matchtime='${date6}'`;

        database
          .raw(query)
          .then(result => {
            resolve({ message: "tips of the week", data: result.rows });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        resolve({ message: "other pkg type", data: null }); // here is the rest package offer to be done
      }
    });
  }
});
