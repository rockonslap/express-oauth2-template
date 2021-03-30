const knex = require('./knex');
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('pagination');

module.exports = bookshelf;
