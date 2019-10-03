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

const signout = (request, response) => {
  const userReq = request.body;
  stuff
    .findUser(userReq)
    .then(user => {
      const usrname = user.data;
      stuff.deleteUser(usrname).then(result => {
        response.status(200).json(result);
      });
    })
    .catch(err => {
      console.log(err);
      response.status(500).json(JSON.parse(error.message));
    });
};

const insertprediction = (request, response) => {
  const pbody = request.body;
  if (!request.body) {
    console.log({ message: "object missing" });
  } else {
    stuff
      .savePrediction(pbody)
      .then(result => {
        // response.status(200).json(result.data);//not needed for the front end
        response.send("SAVING SUCCESS!");
        console.log(result.data);
        console.log("SAVING SUCCESS!");
      })
      .catch(error => {
        console.log(error);
        response.status(500).json(JSON.parse(error.message));
      });
  }
};

const insertfreetip = (request, response) => {
  const pbody = request.body;
  if (!request.body) {
    console.log({ message: "object missing" });
  } else {
    stuff
      .savefreetip(pbody)
      .then(result => {
        if (result.data.length === 0) {
          response.status(400).json(result.data);
        } else {
          response.status(200).json(result.data);
        }
      })
      .catch(error => {
        console.log(error);
        response.status(500).json(JSON.parse(error.message));
      });
  }
};

const deleteprediction = (reques, response) => {
  stuff
    .deleteprediction()
    .then(result => {
      response.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      response.status(500).json(JSON.parse(error.message));
    });
};

module.exports = {
  signin,
  signup,
  signout,
  insertprediction,
  insertfreetip,
  deleteprediction
};
