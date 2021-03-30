const to = require('await-to-js').default;

const {
  ClientRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');
const { getMessage } = require('../../utils/message');

const CreateToken = require('./CreateToken');
const PasswordGrantService = require('./PasswordGrantService');
const RefreshTokenGrantService = require('./RefreshTokenGrantService');

const Validate = (payload, lang) => {
  const constraints = {
    client_id: {
      presence: {
        message: getMessage('ERR02001', lang),
      },
    },
    client_secret: {
      presence: {
        message: getMessage('ERR02002', lang),
      },
    },
    grant_type: {
      presence: {
        message: getMessage('ERR02004', lang),
      },
    },
  };

  return validator(payload, constraints, { fullMessages: false });
};



const TokenService = async (payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  [err, client] = await to(ClientRepository.findByCredential(payload));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (!client) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: getMessage('ERR02005', lang),
    });
  }

  if (payload.grant_type === 'password') {
    [err, passwordGrantData] = await to(PasswordGrantService(client, payload, lang));
    if (err) {
      return Promise.reject(err);
    }

    [err, token] = await to(CreateToken({
      access_token: passwordGrantData.accessToken,
      refresh_token: passwordGrantData.refreshToken,
      user_id: passwordGrantData.user.id,
      client_id: passwordGrantData.client.id,
    }));
    if (err) {
      return Promise.reject({
        status: 500,
        code: 1,
        message: err,
      });
    }

    return token;
  } else if (payload.grant_type === 'refresh_token') {
    [err, refreshTokenGrantData] = await to(RefreshTokenGrantService(client, payload, lang));
    if (err) {
      return Promise.reject({
        status: 500,
        code: 1,
        message: err,
      });
    }

    [err, token] = await to(CreateToken({
      access_token: refreshTokenGrantData.accessToken,
      refresh_token: refreshTokenGrantData.refreshToken,
      user_id: refreshTokenGrantData.user.id,
      client_id: refreshTokenGrantData.client.id,
    }));
    if (err) {
      return Promise.reject({
        status: 500,
        code: 1,
        message: err,
      });
    }

    return token;
  }
};

module.exports = TokenService;
