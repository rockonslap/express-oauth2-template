const bookshelf = require('../db');

const UserAddressModel = bookshelf.Model.extend({
  tableName: 'user_addresses',
  hasTimestamps: true,
});
module.exports = UserAddressModel;
