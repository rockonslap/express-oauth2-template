const to = require('await-to-js').default;
const bcrypt = require('bcryptjs');

const {
  UserRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');
const { generateRandomToken } = require('../../utils/token');
const { getMessage } = require('../../utils/message');

const Validate = (payload, lang) => {
  const constraints = {
    username: {
      presence: {
        message: getMessage('ERR02008', lang),
      },
    },
    password: {
      presence: {
        message: getMessage('ERR02009', lang),
      },
    },
  };

  return validator(payload, constraints, { fullMessages: false });
};

const PasswordGrantService = async (client, payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  [err, user] = await to(UserRepository.findByUsername(payload.username));
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
      message: getMessage('ERR02010', lang),
    });
  }

  const comparePassword = bcrypt.compareSync(payload.password, user.password || '');
  if (!comparePassword) {
    return Promise.reject({
      status: 401,
      code: 1,
      message: getMessage('ERR02010', lang),
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

module.exports = PasswordGrantService;
