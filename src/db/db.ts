const db = knex({
  client: 'mssql',
  connection: {
    host : '189.89.178.14',
    user : 'Soft Line',
    password : '4321',
    database : 'IMPORT',
    port: 65533
  }
});
