const to = require('await-to-js').default;
const moment = require('moment');
const bcrypt = require('bcryptjs');

const {
  UserRepository,
  AccessTokenRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');
const { generateRandomToken } = require('../../utils/token');
const { getMessage } = require('../../utils/message');

const Validate = (payload, lang) => {
  const constraints = {
    refresh_token: {
      presence: {
        message: getMessage('ERR02011', lang),
      },
    },
  };

  return validator(payload, constraints, { fullMessages: false });
};

const RefreshTokenGrantService = async (client, payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  [err, accessToken] = await to(AccessTokenRepository.findByRefreshToken(payload.refresh_token));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (!accessToken) {
    return Promise.reject({
      status: 401,
      code: 1,
      message: getMessage('ERR02012', lang),
    });
  }

  const now = moment();
  const expire = moment(accessToken.refresh_token_expires_on);
  if (now.diff(expire) >= 0) {
    return Promise.reject({
      status: 401,
      code: 1,
      message: getMessage('ERR02012', lang),
    });
  }

  if (accessToken.client_id !== client.id) {
    return Promise.reject({
      status: 401,
      code: 1,
      message: getMessage('ERR02012', lang),
    });
  }

  [err, user] = await to(UserRepository.findByIdAndActive(accessToken.user_id));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (!user) {
    return Promise.reject({
      status: 401,
      code: 1,
      message: getMessage('ERR02012', lang),
    });
  }

  [err] = await to(AccessTokenRepository.deleteById(accessToken.id));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  [err, accessToken] = await to(generateRandomToken());
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  [err, refreshToken] = await to(generateRandomToken());
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  return {
    client,
    user,
    accessToken,
    refreshToken,
  };
};

module.exports = RefreshTokenGrantService;
