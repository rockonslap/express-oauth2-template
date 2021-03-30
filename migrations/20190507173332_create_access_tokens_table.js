exports.up = (knex) => {
  return knex.schema.createTable('access_tokens', (table) => {
    table.increments('id').unsigned().primary();
    table.string('access_token').unique();
    table.timestamp('access_token_expires_on').defaultTo(knex.fn.now());
    table.string('refresh_token').unique();
    table.timestamp('refresh_token_expires_on').defaultTo(knex.fn.now());
    table.integer('user_id').index();
    table.integer('client_id').index();
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('access_tokens');
};
