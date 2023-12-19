import knex from "knex";
const dbConnectionString = `Data Source=189.89.178.14,65533;Network Library=DBMSSOCN;
Initial Catalog=IMPORT;User ID=Soft Line;Password=4321;`;
const db = knex({
  client: "mssql",
  connection: {
    host: "189.89.178.14",
    user: "Soft Line",
    password: "4321",
    database: "IMPORT",
    port: 65533,
  },
});

export default db;
