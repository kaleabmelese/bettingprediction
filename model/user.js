const environment = process.env.NODE_ENV || "development"; // set environment
const configuration = require("../knexfile")[environment]; // pull in correct db with env configs
const database = require("knex")(configuration); // define database based on above
const bcrypt = require("bcrypt"); // bcrypt will encrypt passwords to be saved in db
const crypto = require("crypto"); // built-in encryption node module
const stuff = require("./stuff");

const getpredictions = (request, response) => {
  stuff
    .fetchprediction()
    .then(result => {
      // if (result.data.length === 0) {
      response.status(200).json(result.data);
      // } else {
      // console.log(result.data);
      // response.status(200).json(result.data);
      // }
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
      response.status(500).json(JSON.parse(err.message));
    });
};

const buypackage = (request, response) => {
  const pkgbody = request.body;
  stuff
    .package(pkgbody)
    .then(result => {
      if (result.data >= 50) {
        console.log(result);
        response.status(200).json(result.data);
      } else {
        console.log(result);
        response.status(200).json(result.data);
      }
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = {
  getpredictions,
  homepage,
  buypackage
};
