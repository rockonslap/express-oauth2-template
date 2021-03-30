const to = require('await-to-js').default;
const knex = require('../db/knex');
const { UserModel } = require('../models');

exports.findById = async (id) => {
  [err, user] = await to(new UserModel()
    .where('id', id)
    .where('deleted_at', null)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (user) ? user.toJSON() : null;
};

exports.findByIdAndActive = async (id) => {
  [err, user] = await to(new UserModel()
    .where('id', id)
    .where('deleted_at', null)
    .where('active', true)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (user) ? user.toJSON() : null;
};

exports.findByUsername = async (username) => {
  [err, user] = await to(new UserModel()
    .where('username', username.toLowerCase())
    .where('deleted_at', null)
    .where('active', true)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (user) ? user.toJSON() : null;
};

exports.findByFbId = async (fbId) => {
  [err, user] = await to(new UserModel()
    .where('fb_id', fbId)
    .where('deleted_at', null)
    .where('active', true)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (user) ? user.toJSON() : null;
};

exports.findByLineId = async (fbId) => {
  [err, user] = await to(new UserModel()
    .where('line_id', fbId)
    .where('deleted_at', null)
    .where('active', true)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (user) ? user.toJSON() : null;
};

exports.countByUsername = async (username) => {
  [err, count] = await to(new UserModel()
    .where('username', username.toLowerCase())
    .where('deleted_at', null)
    .count('id'));
  if (err) {
    return Promise.reject(err);
  }

  return parseInt(count, 10) || 0;
};

exports.countByFbId = async (fbId) => {
  [err, count] = await to(new UserModel()
    .where('fb_id', fbId)
    .where('deleted_at', null)
    .count('id'));
  if (err) {
    return Promise.reject(err);
  }

  return parseInt(count, 10) || 0;
};

exports.countByLineId = async (fbId) => {
  [err, count] = await to(new UserModel()
    .where('line_id', fbId)
    .where('deleted_at', null)
    .count('id'));
  if (err) {
    return Promise.reject(err);
  }

  return parseInt(count, 10) || 0;
};

exports.createOne = async (payload) => {
  [err, user] = await to(new UserModel({
    ...payload,
  }).save());
  if (err) {
    return Promise.reject(err);
  }

  return (user) ? user.toJSON() : null;
};

exports.updateById = async (id, payload) => {
  [err, user] = await to(new UserModel()
    .where('id', id)
    .where('deleted_at', null)
    .save({
      ...payload,
    }, {
      patch: true,
    }));
  if (err) {
    return Promise.reject(err);
  }

  return (user) ? user.toJSON() : null;
};

exports.deleteById = async (id) => {
  [err, user] = await to(new UserModel()
    .where('id', id)
    .save({
      deleted_at: knex.fn.now(),
    }, {
      patch: true,
    }));
  if (err) {
    return Promise.reject(err);
  }
};

exports.findWithPage = async (page = 1, role = null, search = null) => {
  const user = new UserModel()
    .where('fb_id', null)
    .where('line_id', null)
    .where('role', '<>', 'user')
    .where('deleted_at', null);

  if (role) {
    user.where('role', role);
  }

  if (search) {
    user.where('email', 'LIKE', `%${search}%`);
  }

  [err, lists] = await to(user.fetchPage({
    pageSize: 10,
    page,
  }));
  if (err) {
    return Promise.reject(err);
  }

  return {
    pagination: lists.pagination,
    lists: lists.toJSON(),
  };
};
