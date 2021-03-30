exports.up = (knex) => {
  return knex.schema.createTable('user_addresses', (table) => {
    table.increments('id').unsigned().primary();
    table.integer('user_id').index();
    table.decimal('lat', 15, 10).index();
    table.decimal('lng', 15, 10).index();
    table.string('name');
    table.json('address');
    table.string('tel');
    table.boolean('is_default').defaultTo(false);
    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('user_addresses');
};
