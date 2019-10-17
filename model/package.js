const moment = require("moment");
const environment = process.env.NODE_ENV || "development"; // set environment
const configuration = require("../knexfile")[environment]; // pull in correct db with env configs
const database = require("knex")(configuration); // define database based on above
const bcrypt = require("bcrypt"); // bcrypt will encrypt passwords to be saved in db
const crypto = require("crypto"); // built-in encryption node module
const dbexec = require("../database/dbexec")

const package = (module.exports) = {
    buypkg: pkgbody => {
        //pkgtype 1=>daily package, 2=>weekly, 3=>monthly, 4=>semi annual and 5=>annual
        return new Promise((resolve, reject) => {
            if (pkgbody.pkgtype === 1) {
                const day = new Date();
                var today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
                const query = `SELECT * FROM predictions WHERE matchtime='${today}'`;

                dbexec.onlyquery(query).then(result => {
                    if (result.length === 0) {
                        resolve({
                            message: "there are no tips for today",
                            data: result
                        });
                    } else if (result.length <= 50) {
                        resolve({ message: "tips provided", data: result });
                    } else {
                        resolve({
                            message: "data is too large",
                            data: "length" + result.length
                        });
                    }
                })
                    .catch(err => {
                        reject(err);
                    });
            } else if (pkgbody.pkgtype === 2) {

                const day = new Date();
                const today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
                const dayseven = moment().add(7, "days").format("l");
                const query = `SELECT * FROM predictions WHERE matchtime::date between '${today}' and '${dayseven}' `;

                dbexec.onlyquery(query).then(result => {
                    if (result.length === 0) {
                        resolve({
                            message: "there are no tips for today",
                            data: result
                        });
                    } else if (result.length >= 50) {
                        resolve({
                            message: "data is too large",
                            data: "length" + result.length
                        });
                    } else {
                        resolve({
                            message: "tips provided",
                            data: result
                        });
                    }
                }).catch(err => {
                    reject(err);
                    console.log(err);
                });
            } else if (pkgbody.pkgtype === 3) {
                const day = new Date();
                const today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
                const daythirty = moment().add(30, "days").format("l");
                const query = `SELECT * FROM predictions WHERE matchtime::date between '${today}' and '${daythirty}' `;

                dbexec.onlyquery(query).then(result => {
                    if (result.length === 0) {
                        resolve({
                            message: "there are no tips for today",
                            data: result
                        });
                    } else if (result.length <= 50) {
                        resolve({
                            message: "tips provided",
                            data: result
                        });
                    } else {
                        resolve({
                            message: "data is too large",
                            data: result.length
                        });
                    }
                }).catch(err => {
                    reject(err);
                });
            } else if (pkgbody.pkgtype === 4) {
                const day = new Date();
                const today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
                const sixthmonth = moment().add(180, "days").format("l");
                const query = `SELECT * FROM predictions WHERE matchtime::date between '${today}' and '${sixthmonth}' `;

                dbexec.onlyquery(query).then(result => {
                    if (result.length === 0) {
                        resolve({
                            message: "there are no tips for today",
                            data: result
                        });
                    } else if (result.length <= 50) {
                        resolve({
                            message: "tips provided",
                            data: result
                        });
                    } else {
                        resolve({
                            message: "data is too large",
                            data: result.length
                        });
                    }
                }).catch(err => {
                    reject(err);
                });
            } else if (pkgbody.pkgtype === 5) {
                const day = new Date();
                const today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
                const ayear = (day.getFullYear() + 1) + "-" + (day.getMonth() + 1) + "-" + day.getDate();
                const query = `SELECT * FROM predictions WHERE matchtime::date between '${today}' and '${ayear}'`

                dbexec.onlyquery(query).then(result => {
                    if (result.length === 0) {
                        resolve({
                            message: "there are no tips for today",
                            data: result
                        });
                    } else if (result.length <= 50) {
                        resolve({
                            message: "tips provided",
                            data: result
                        });
                    } else {
                        resolve({
                            message: "data is too large",
                            data: result.length
                        });
                    }
                }).catch(err => {
                    reject(err);
                });
            } else {
                resolve({ message: "other pkg type", data: null }); // here is the rest package offer to be done
            }
        });
    }
}
