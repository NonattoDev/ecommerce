module.exports = {
  client: "mssql",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWD,
    database: process.env.DB_NAME,
    port: 1433,
  },
};
