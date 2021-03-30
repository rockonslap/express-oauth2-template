const pg = require('pg');

pg.types.setTypeParser(1700, parseFloat);
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'rockonslap',
    password: '',
    database: 'express-oauth2-example',
  },
});

module.exports = knex;
