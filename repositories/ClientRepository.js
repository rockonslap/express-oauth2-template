const to = require('await-to-js').default;
const { ClientModel } = require('../models');

exports.findById = async (id) => {
  [err, client] = await to(new ClientModel()
    .where('id', id)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (client) ? client.toJSON() : null;
};

exports.findByCredential = async (payload) => {
  [err, client] = await to(new ClientModel()
    .where('client_id', payload.client_id)
    .where('client_secret', payload.client_secret)
    .fetch());
  if (err) {
    return Promise.reject(err);
  }

  return (client) ? client.toJSON() : null;
};

exports.createOne = async (payload) => {
  [err, client] = await to(new ClientModel({
    client_id: payload.client_id,
    client_secret: payload.client_secret,
  }).save());
  if (err) {
    return Promise.reject(err);
  }

  return (client) ? client.toJSON() : null;
};

exports.updateById = async (id, payload) => {
  [err, client] = await to(new ClientModel()
    .where('id', id)
    .save({
      client_id: payload.client_id,
      client_secret: payload.client_secret,
    }, {
      patch: true,
    }));
  if (err) {
    return Promise.reject(err);
  }

  return (client) ? client.toJSON() : null;
};

exports.deleteById = async (id) => {
  [err, count] = await to(new ClientModel()
    .where('id', id)
    .count('id'));
  if (err) {
    return Promise.reject(err);
  }

  if (count > 0) {
    [err] = await to(new ClientModel()
      .where('id', id)
      .destroy());
    if (err) {
      return Promise.reject(err);
    }
  }
};

exports.findAll = async () => {
  [err, clients] = await to(new ClientModel()
    .fetchAll());
  if (err) {
    return Promise.reject(err);
  }

  return clients.toJSON();
};
