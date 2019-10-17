const dbexec = require("../database/dbexec")

const prediction = (module.exports) = {
    savePrediction: pbody => {
        return new Promise((resolve, reject) => {
            const matchinfo = pbody;
            const query = "INSERT INTO predictions(league,team1,team2,tip,matchtime,inserted_at) VALUES(?,?,?,?,?,?) RETURNING *";
            const arr = [matchinfo.league, matchinfo.team1, matchinfo.team2, matchinfo.tip, matchinfo.matchtime, new Date()]

            dbexec.dataquery(query, arr).then(result => {
                if (result.length === 0) {
                    resolve({ message: "data is not inserted" });
                }
                else if (result.length > 1) {
                    resolve({
                        message: "data too large to process",
                        data: result
                    });
                }
                else {
                    resolve({ message: "POST_SUCCESS", data: result });
                }
            }).catch(err => {
                reject(err)
            })
        })

    },
    fetchprediction: () => {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM predictions`;
            dbexec.onlyquery(query).then(result => {
                if (result.length === 0) {
                    resolve({
                        status: "No error",
                        message: "there are no predictions",
                        data: result.length
                    });
                } else {
                    resolve({
                        status: "NO_ERROR",
                        message: "Request correct",
                        data: result
                    });
                }
            })
                .catch(err => {
                    reject(err);
                });

        })
    },
    deleteprediction: () => {
        return new Promise((resolve, reject) => {
            const query = "delete from predictions";
            dbexec.onlyquery(query).then(result => {
                if (result.length === 0) {
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

        })



    }
}