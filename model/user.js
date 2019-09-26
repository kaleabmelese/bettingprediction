const environment = process.env.NODE_ENV || "development"; // set environment
const configuration = require("../knexfile")[environment]; // pull in correct db with env configs
const database = require("knex")(configuration); // define database based on above
const bcrypt = require("bcrypt"); // bcrypt will encrypt passwords to be saved in db
const crypto = require("crypto"); // built-in encryption node module
const stuff = require("./stuff");

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
  getpredictions,
  homepage
};
