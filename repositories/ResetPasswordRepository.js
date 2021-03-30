const to = require('await-to-js').default;
const { ResetPasswordModel } = require('../models');

exports.findById = async (id) => {
  [err, resetPassword] = await to(new ResetPasswordModel()
    .where('id', id)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (resetPassword) ? resetPassword.toJSON() : null;
};

exports.findByToken = async (token) => {
  [err, resetPassword] = await to(new ResetPasswordModel()
    .where('token', token)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (resetPassword) ? resetPassword.toJSON() : null;
};

exports.createOne = async (payload) => {
  [err, resetPassword] = await to(new ResetPasswordModel({
    ...payload,
  }).save());
  if (err) {
    return Promise.reject(err);
  }

  return (resetPassword) ? resetPassword.toJSON() : null;
};

exports.updateById = async (id, payload) => {
  [err, resetPassword] = await to(new ResetPasswordModel()
    .where('id', id)
    .save({
      ...payload,
    }, {
      patch: true,
    }));
  if (err) {
    return Promise.reject(err);
  }

  return (resetPassword) ? resetPassword.toJSON() : null;
};

exports.deleteById = async (id) => {
  [err, count] = await to(new ResetPasswordModel()
    .where('id', id)
    .count('id'));
  if (err) {
    return Promise.reject(err);
  }

  if (count > 0) {
    [err] = await to(new ResetPasswordModel()
      .where('id', id)
      .destroy());
    if (err) {
      return Promise.reject(err);
    }
  }
};

exports.deleteByToken = async (token) => {
  [err, count] = await to(new ResetPasswordModel()
    .where('token', token)
    .count('id'));
  if (err) {
    return Promise.reject(err);
  }

  if (count > 0) {
    [err] = await to(new ResetPasswordModel()
      .where('token', token)
      .destroy());
    if (err) {
      return Promise.reject(err);
    }
  }
};

exports.findAll = async () => {
  [err, resetPasswords] = await to(new ResetPasswordModel()
    .fetchAll());
  if (err) {
    return Promise.reject(err);
  }

  return resetPasswords.toJSON();
};
