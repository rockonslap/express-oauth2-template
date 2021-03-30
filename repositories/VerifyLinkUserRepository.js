const to = require('await-to-js').default;
const { VerifyLinkUserModel } = require('../models');

exports.findById = async (id) => {
  [err, verifyLinkUser] = await to(new VerifyLinkUserModel()
    .where('id', id)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (verifyLinkUser) ? verifyLinkUser.toJSON() : null;
};

exports.findByToken = async (token) => {
  [err, verifyLinkUser] = await to(new VerifyLinkUserModel()
    .where('token', token)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (verifyLinkUser) ? verifyLinkUser.toJSON() : null;
};

exports.createOne = async (payload) => {
  [err, verifyLinkUser] = await to(new VerifyLinkUserModel({
    ...payload,
  }).save());
  if (err) {
    return Promise.reject(err);
  }

  return (verifyLinkUser) ? verifyLinkUser.toJSON() : null;
};

exports.updateById = async (id, payload) => {
  [err, verifyLinkUser] = await to(new VerifyLinkUserModel()
    .where('id', id)
    .save({
      ...payload,
    }, {
      patch: true,
    }));
  if (err) {
    return Promise.reject(err);
  }

  return (verifyLinkUser) ? verifyLinkUser.toJSON() : null;
};

exports.deleteById = async (id) => {
  [err, count] = await to(new VerifyLinkUserModel()
    .where('id', id)
    .count('id'));
  if (err) {
    return Promise.reject(err);
  }

  if (count > 0) {
    [err] = await to(new VerifyLinkUserModel()
      .where('id', id)
      .destroy());
    if (err) {
      return Promise.reject(err);
    }
  }
};

exports.deleteByToken = async (token) => {
  [err, count] = await to(new VerifyLinkUserModel()
    .where('token', token)
    .count('id'));
  if (err) {
    return Promise.reject(err);
  }

  if (count > 0) {
    [err] = await to(new VerifyLinkUserModel()
      .where('token', token)
      .destroy());
    if (err) {
      return Promise.reject(err);
    }
  }
};

exports.findAll = async () => {
  [err, verifyLinkUser] = await to(new VerifyLinkUserModel()
    .fetchAll());
  if (err) {
    return Promise.reject(err);
  }

  return verifyLinkUser.toJSON();
};
