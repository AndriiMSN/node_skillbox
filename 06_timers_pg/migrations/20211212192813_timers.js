exports.up = function (knex) {
  return knex.schema.createTable("timers", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable();
    table.foreign("user_id").references("users.id");
    table.bigInteger("start").notNullable();
    table.string("description").notNullable();
    table.boolean("isActive").defaultTo(true);
    table.integer("duration").nullable();
    table.bigInteger("end").nullable();
    table.bigInteger("progress").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("timers");
};
