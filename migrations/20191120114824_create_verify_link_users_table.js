exports.up = (knex) => {
  return knex.schema.createTable('verify_link_users', (table) => {
    table.increments('id').unsigned().primary();
    table.integer('user_id').index();
    table.integer('link_user_id').index();
    table.string('email');
    table.string('token').unique();
    table.string('otp').index();
    table.timestamp('token_expires_on').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('verify_link_users');
};
