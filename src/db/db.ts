import knex from "knex";

// const db = knex({
//   client: "mssql",
//   connection: {
//     host: "189.89.178.14",
//     user: "Soft Line",
//     password: "4321",
//     database: "IMPORT",
//     port: 65533,
//   },
// });
const db = knex({
  client: "mssql",
  connection: {
    host: "38.9.119.170",
    user: "Soft Line",
    password: "4321",
    database: "ATLANTICO",
    port: 54112,
  },
});

export default db;
