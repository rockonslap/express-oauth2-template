const to = require('await-to-js').default;
const moment = require('moment');

const {
  AccessTokenRepository,
} = require('../../repositories');

const CreateToken = async (payload) => {
  [err, token] = await to(AccessTokenRepository.createOne({
    ...payload,
    access_token_expires_on: moment().add(2, 'hours').format(),
    refresh_token_expires_on: moment().add(2, 'weeks').format(),
  }));

  if (err) {
    return Promise.reject(err);
  }

  return {
    access_token: token.access_token,
    token_type: 'Bearer',
    expires_at: token.access_token_expires_on,
    refresh_token: token.refresh_token,
  };
};

module.exports =  CreateToken;