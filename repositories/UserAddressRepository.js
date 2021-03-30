const to = require('await-to-js').default;
const knex = require('../db/knex');
const { UserAddressModel } = require('../models');

exports.findByIdAndUserId = async (id, userId) => {
  [err, userAddress] = await to(new UserAddressModel()
    .where('user_id', userId)
    .where('id', id)
    .where('deleted_at', null)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (userAddress) ? userAddress.toJSON() : null;
};

exports.countByUserId = async (userId) => {
  [err, count] = await to(new UserAddressModel()
    .where('user_id', userId)
    .where('deleted_at', null)
    .count('id'));
  if (err) {
    return Promise.reject(err);
  }

  return parseInt(count, 10) || 0;
};

exports.createOne = async (userId, payload) => {
  [err, userAddress] = await to(new UserAddressModel({
    user_id: userId,
    lat: payload.lat,
    lng: payload.lng,
    name: payload.name,
    address: JSON.stringify(payload.address),
    tel: payload.tel,
    is_default: payload.is_default || false,
  }).save());
  if (err) {
    return Promise.reject(err);
  }

  return (userAddress) ? {
    ...userAddress.toJSON(),
    address: JSON.parse(userAddress.get('address')),
  } : null;
};

exports.updateByIdAndUserId = async (id, userId, payload) => {
  [err, userAddress] = await to(new UserAddressModel()
    .where('user_id', userId)
    .where('id', id)
    .where('deleted_at', null)
    .save({
      lat: payload.lat,
      lng: payload.lng,
      name: payload.name,
      address: JSON.stringify(payload.address),
      tel: payload.tel,
      is_default: payload.is_default || false,
    }, {
      patch: true,
    }));
  if (err) {
    return Promise.reject(err);
  }

  return (userAddress) ? {
    ...userAddress.toJSON(),
    address: JSON.parse(userAddress.get('address')),
  } : null;
};

exports.updateIsDefaultByIdAndUserId = async (id, userId, isDefault) => {
  [err, userAddress] = await to(new UserAddressModel()
    .where('user_id', userId)
    .where('id', id)
    .where('deleted_at', null)
    .save({
      is_default: isDefault || false,
    }, {
      patch: true,
    }));
  if (err) {
    return Promise.reject(err);
  }

  return (userAddress) ? userAddress.toJSON() : null;
};

exports.updateIsDefaultUserId = async (userId, isDefault) => {
  [err, userAddress] = await to(new UserAddressModel()
    .where('user_id', userId)
    .where('deleted_at', null)
    .save({
      is_default: isDefault || false,
    }, {
      patch: true,
    }));
  if (err) {
    return Promise.reject(err);
  }

  return (userAddress) ? userAddress.toJSON() : null;
};

exports.deleteByIdAndUserId = async (id, userId) => {
  [err, userAddress] = await to(new UserAddressModel()
    .where('user_id', userId)
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

exports.findByUserIdWithPage = async (userId, page = 1) => {
  const userAddress = new UserAddressModel()
    .where('user_id', userId)
    .where('deleted_at', null);

  [err, lists] = await to(userAddress.fetchPage({
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
