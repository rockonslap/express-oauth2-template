require('dotenv').config();
const to = require('await-to-js').default;
const moment = require('moment');

const { generateRandomToken } = require('../../utils/token');
const { getMessage } = require('../../utils/message');

const {
  UserRepository,
  ResetPasswordRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');

const Validate = (payload, lang) => {
  const constraints = {
    email: {
      presence: {
        message: getMessage('ERR02013', lang),
      },
    },
  };

  return validator(payload, constraints, { fullMessages: false });
};

const RequestResetPasswordService = async (payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  [err, user] = await to(UserRepository.findByUsername(payload.email));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (!user) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: getMessage('ERR02014', lang),
    });
  }

  [err, token] = await to(generateRandomToken());
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  [err, resetPassword] = await to(ResetPasswordRepository.createOne({
    user_id: user.id,
    token,
    token_expires_on: moment().add(1, 'hours').format(),
  }));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  // TODO Send Email
};

module.exports = RequestResetPasswordService;
