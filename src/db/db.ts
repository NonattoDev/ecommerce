import knex from "knex";

const db = knex({
  client: "mssql",
  connection: {
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "1433", 10),
    options: {
      encrypt: false, // Caso esteja utilizando uma conexão segura
      trustServerCertificate: true,
    },
  },
});

export default db;
