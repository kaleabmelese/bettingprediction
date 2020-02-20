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
