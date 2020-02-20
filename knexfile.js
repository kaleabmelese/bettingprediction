const devConfig = {
  client: "postgresql",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./knex/migrations"
  },
  seeds: {
    directory: "./knex/seeds/userseed"
  },
  useNullAsDefault: true
}
const prodConfig = Object.assign(
  {},
  devConfig,
  { client: 'pg', connection: process.env.DATABASE_URL}
)

module.exports = {
  development: devConfig,
  production: prodConfig
}