const stuff = require("./stuff");
const prediction = require("./predictions")
const freetip = require("./freetip")
const package = require("./package")

const getpredictions = (request, response) => {
  prediction
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
  freetip
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

  package.buypkg(pkgbodyq)
    .then(result => {
      response.status(200).json(result.data);
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
