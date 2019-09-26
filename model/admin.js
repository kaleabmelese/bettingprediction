const environment = process.env.NODE_ENV || "development"; // set environment
const configuration = require("../knexfile")[environment]; // pull in correct db with env configs
const database = require("knex")(configuration); // define database based on above
const bcrypt = require("bcrypt"); // bcrypt will encrypt passwords to be saved in db
const crypto = require("crypto"); // built-in encryption node module
const stuff = require("./stuff");

const express = require("express");

const insertprediction = (request, response) => {
  const pbody = request.body;
  stuff
    .savePrediction(pbody)
    .then(result => {
      if (result.data.length === 0) {
        response.status(400).json(result);
      } else {
        response.status(200).json(result);
      }
    })
    .catch(error => {
      console.log(error);
      response.status(500).json(JSON.parse(error.message));
    });
};

const insertfreetip = (request, response) => {
  const pbody = request.body;
  stuff
    .savefreetip(pbody)
    .then(result => {
      if (result.data.length === 0) {
        response.status(400).json(result);
      } else {
        response.status(200).json(result);
      }
    })
    .catch(error => {
      console.log(error);
      response.status(500).json(JSON.parse(error.message));
    });
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
  insertprediction,
  insertfreetip,
  deleteprediction
};
