const bookshelf = require('../db');

const VerifyLinkUserModel = bookshelf.Model.extend({
  tableName: 'verify_link_users',
  hasTimestamps: true,
});
module.exports = VerifyLinkUserModel;
