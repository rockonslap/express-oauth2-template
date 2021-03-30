const bookshelf = require('../db');

const UserModel = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
});
module.exports = UserModel;
