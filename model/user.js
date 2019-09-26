const environment = process.env.NODE_ENV || "development"; // set environment
const configuration = require("../knexfile")[environment]; // pull in correct db with env configs
const database = require("knex")(configuration); // define database based on above
const bcrypt = require("bcrypt"); // bcrypt will encrypt passwords to be saved in db
const crypto = require("crypto"); // built-in encryption node module
const stuff = require("./stuff");

const signup = (request, response) => {
  const user = request.body;
  stuff
    .hashPassword(user.password)
    .then(hashedPassword => {
      delete user.password;
      user.password_digest = hashedPassword;
    })
    .then(() => stuff.createToken())
    .then(token => (user.token = token))
    .then(() => stuff.createUser(user))
    .then(user => {
      delete user.password_digest;
      response.status(201).json({ user });
    })
    .catch(err => console.error(err));
};

const signin = (request, response) => {
  const userReq = request.body;
  let user;

  stuff
    .findUser(userReq)
    .then(foundUser => {
      user = foundUser;
      return stuff.checkPassword(userReq.password, foundUser);
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => stuff.createToken())
    .then(token => stuff.updateUserToken(token, user))
    .then(() => {
      delete user.password_digest;
      response.status(200).json(user);
    })
    .catch(err => console.error(err));
};
const getpredictions = (request, response) => {
  const pbody = request.body;
  stuff
    .fetchprediction(pbody)
    .then(result => {
      if (result.data.length === 0) {
        response.status(400).json(result);
      } else {
        console.log(result.data);
        response.status(200).json(result.data);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

const homepage = (request, response) => {
  stuff
    .fetchfreetip()
    .then(result => {
      response.status(200).json(result.data);
    })
    .catch(err => {
      console.log(err);
      // response.status(500).json(JSON.parse(err.message));
    });
};

module.exports = {
  signup,
  signin,
  getpredictions,
  homepage
};
