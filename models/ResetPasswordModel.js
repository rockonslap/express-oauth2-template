const bookshelf = require('../db');

const ResetPasswordModel = bookshelf.Model.extend({
  tableName: 'reset_passwords',
  hasTimestamps: true,
});
module.exports = ResetPasswordModel;
