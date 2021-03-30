exports.up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').unsigned().primary();
    table.string('username').index();
    table.string('password').index();
    table.string('email').index();
    table.string('full_name');
    table.string('tel');
    table.string('profile_image_url');
    table.string('fb_id').index();
    table.string('line_id').index();
    table.string('role').defaultTo('user').index();
    table.boolean('active').defaultTo(true).index();
    table.timestamps(true, true);
    table.timestamp('deleted_at');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
