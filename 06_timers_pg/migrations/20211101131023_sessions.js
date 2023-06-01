exports.up = function (knex) {
  return knex.schema.createTable("sessions", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable();
    table.foreign("user_id").references("users.id");
    table.string("session_id", 255);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sessions");
};
