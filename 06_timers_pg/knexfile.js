require("dotenv").config();


module.exports = {
  client: "pg",
  connection: process.env.DB_CONNECTION,
  migrations: {
    tableName: "knex_migrations"
  }
};
