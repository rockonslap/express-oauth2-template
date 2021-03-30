const bookshelf = require('../db');

const AccessTokenModel = bookshelf.Model.extend({
  tableName: 'access_tokens',
  hasTimestamps: true,
});
module.exports = AccessTokenModel;
