exports.up = (knex) => {
  return knex.schema.createTable('reset_passwords', (table) => {
    table.increments('id').unsigned().primary();
    table.integer('user_id').index();
    table.string('token').unique();
    table.timestamp('token_expires_on').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('reset_passwords');
};
