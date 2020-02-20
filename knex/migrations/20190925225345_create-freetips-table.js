exports.up = function(knex) {
  let createQuery = `CREATE TABLE freetips(
        id SERIAL PRIMARY KEY NOT NULL,
        League TEXT NOT NULL,
        team1 varchar(20),
        team2 varchar(20),
        tip VARCHAR(2),
        matchtime DATE NOT NULL,
        inserted_at TIMESTAMP
      )`;
  return knex.raw(createQuery);
};

exports.down = function(knex) {
  let dropQuery = `DROP TABLE freetips`;
  return knex.raw(dropQuery);
};
