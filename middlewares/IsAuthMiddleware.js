const to = require('await-to-js').default;
const moment = require('moment');

const response = require('../utils/response');

const {
  UserRepository,
  AccessTokenRepository,
} = require('../repositories');

const {
  getTokenFromRequestHeader,
} = require('../utils/token');

const IsAuthMiddleware = async (req, resp, next) => {
  [err, token] = await to(getTokenFromRequestHeader(req));
  if (err) {
    return response.format(resp, null, {
      status: 401,
      code: 1,
      message: err,
    });
  }

  [err, accessToken] = await to(AccessTokenRepository.findByAccessToken(token));
  if (err) {
    return response.format(resp, null, {
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (!accessToken) {
    return response.format(resp, null, {
      status: 401,
      code: 1,
      message: 'Unauthorized',
    });
  }

  const now = moment();
  const expire = moment(accessToken.access_token_expires_on);
  if (now.diff(expire) >= 0) {
    return response.format(resp, null, {
      status: 401,
      code: 1,
      message: 'Unauthorized',
    });
  }

  [err, user] = await to(UserRepository.findByIdAndActive(accessToken.user_id));
  if (err) {
    return response.format(resp, null, {
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (!user) {
    return response.format(resp, null, {
      status: 401,
      code: 1,
      message: 'Unauthorized',
    });
  }

  req.user = {
    ...user,
    password: undefined,
  };

  req.user_token = token;

  next();
};

module.exports = IsAuthMiddleware;
