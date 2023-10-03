const knex = require("knex");
const config = require("./knexfile");

const db = knex({
  client: "mssql",
  connection: {
    server: config.connection.host,
    user: config.connection.user,
    password: config.connection.password,
    database: config.connection.database,
    port: config.connection.port,
    options: {
      encrypt: false, // Caso esteja utilizando uma conexão segura
    },
  },
});

module.exports = db;
