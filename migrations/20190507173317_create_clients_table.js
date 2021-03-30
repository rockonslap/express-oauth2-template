exports.up = (knex) => {
  return knex.schema.createTable('clients', (table) => {
    table.increments('id').unsigned().primary();
    table.string('client_id').index();
    table.string('client_secret').index();
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('clients');
};
