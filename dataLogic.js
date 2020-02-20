module.exports = {
  connection: () => {
    let Db = null
    if ( process.env.NODE_ENV==='production') {
        if( process.env.DATABASE_URL) {
            Db = require('knex')({
                client: 'pg',
                connection: process.env.DATABASE_URL
            })
            return Db;
        } else {
            throw new Error(`{ status: "Environment error" , message: "There is no DATABASE_URL defined for the production environment}`)
        }
        
    } else {
        let environment = process.env.NODE_ENV || 'development'
        const knexFile = require('./knexfile')[environment]
        let Db = require('knex')(knexFile)
        return Db;
    }
  }
}