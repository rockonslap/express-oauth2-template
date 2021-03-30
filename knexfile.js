module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      port: 5432,
      user: 'rockonslap',
      password: '',
      database: 'express-oauth2-example',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'auth_migrations',
    },
  },
};
