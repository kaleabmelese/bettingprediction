const moment = require("moment");
const environment = process.env.NODE_ENV || "development"; // set environment
const configuration = require("../knexfile")[environment]; // pull in correct db with env configs
const database = require("knex")(configuration); // define database based on above
const bcrypt = require("bcryptjs"); // bcrypt will encrypt passwords to be saved in db
const crypto = require("crypto"); // built-in encryption node module
const dbexec = require("../database/dbexec")


const freetip = (module.exports) = {
    savefreetip: pbody => {
        return new Promise((resolve, reject) => {
            const tipinfo = pbody;
            const arr = [tipinfo.league, tipinfo.team1, tipinfo.team2, tipinfo.tip, tipinfo.matchtime, new Date()]
            const query = "INSERT INTO freetips(league,team1,team2,tip,matchtime,inserted_at) VALUES (?,?,?,?,?,?) RETURNING *";
            dbexec.dataquery(query, arr).then(result => {
                if (result.length === 0) {
                    resolve({
                        message: "there are no free tips for today",
                        data: result.length
                    });
                } else {
                    resolve({
                        message: "tips of the day",
                        data: result
                    });
                }
            })
                .catch(err => {
                    reject(err);
                });
        })
    },
    fetchfreetip: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM freetips`;
            dbexec.onlyquery(query).then(result => {
                if (result.length === 0) {
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
                        data: result
                    });
                }
            })
                .catch(err => {
                    reject(err);
                });
        })
    }
}