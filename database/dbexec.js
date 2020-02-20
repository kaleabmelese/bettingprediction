// const environment = process.env.NODE_ENV || "development"; // set environment
// const configuration = require("../knexfile")[environment]; // pull in correct db with env configs
// const database = require("knex")(configuration); // define database based on above
const database = require('../dataLogic').connection()
const dbexec = (module.exports = {
    onlyquery: query => {
        return new Promise((resolve, reject) => {
            database.raw(query).then(result => {
                resolve(result.rows)
            })
        })
    },
    dataquery: (query, arr) => {
        return new Promise((resolve, reject) => {
            database.raw(query, arr).then(result => {
                resolve(result.rows)
            })
        })
    }
})
