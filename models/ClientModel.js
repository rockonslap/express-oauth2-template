const bookshelf = require('../db');

const ClientModel = bookshelf.Model.extend({
  tableName: 'clients',
  hasTimestamps: true,
});
module.exports = ClientModel;
