const to = require('await-to-js').default;
const { AccessTokenModel } = require('../models');

exports.findById = async (id) => {
  [err, accessToken] = await to(new AccessTokenModel()
    .where('id', id)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (accessToken) ? accessToken.toJSON() : null;
};

exports.findByAccessToken = async (token) => {
  [err, accessToken] = await to(new AccessTokenModel()
    .where('access_token', token)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (accessToken) ? accessToken.toJSON() : null;
};

exports.findByRefreshToken = async (token) => {
  [err, accessToken] = await to(new AccessTokenModel()
    .where('refresh_token', token)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (accessToken) ? accessToken.toJSON() : null;
};

exports.createOne = async (payload) => {
  [err, accessToken] = await to(new AccessTokenModel({
    ...payload,
  }).save());
  if (err) {
    return Promise.reject(err);
  }

  return (accessToken) ? accessToken.toJSON() : null;
};

exports.updateById = async (id, payload) => {
  [err, accessToken] = await to(new AccessTokenModel()
    .where('id', id)
    .save({
      ...payload,
    }, {
      patch: true,
    }));
  if (err) {
    return Promise.reject(err);
  }

  return (accessToken) ? accessToken.toJSON() : null;
};

exports.deleteById = async (id) => {
  [err, count] = await to(new AccessTokenModel()
    .where('id', id)
    .count('id'));
  if (err) {
    return Promise.reject(err);
  }

  if (count > 0) {
    [err] = await to(new AccessTokenModel()
      .where('id', id)
      .destroy());
    if (err) {
      return Promise.reject(err);
    }
  }
};

exports.deleteByRefreshToken = async (token) => {
  [err, count] = await to(new AccessTokenModel()
    .where('refresh_token', token)
    .count('id'));
  if (err) {
    return Promise.reject(err);
  }

  if (count > 0) {
    [err] = await to(new AccessTokenModel()
      .where('refresh_token', token)
      .destroy());
    if (err) {
      return Promise.reject(err);
    }
  }
};

exports.findAll = async () => {
  [err, accessTokens] = await to(new AccessTokenModel()
    .fetchAll());
  if (err) {
    return Promise.reject(err);
  }

  return accessTokens.toJSON();
};
