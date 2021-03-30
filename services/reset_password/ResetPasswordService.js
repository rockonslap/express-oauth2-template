const to = require('await-to-js').default;
const bcrypt = require('bcryptjs');
const moment = require('moment');

const {
  UserRepository,
  ResetPasswordRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');
const { getMessage } = require('../../utils/message');

const Validate = (payload, lang) => {
  const constraints = {
    token: {
      presence: {
        message: getMessage('ERR02015', lang),
      },
    },
    new_password: {
      presence: {
        message: getMessage('ERR02016', lang),
      },
    },
  };

  return validator(payload, constraints, { fullMessages: false });
};

const ResetPasswordService = async (payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  [err, resetPassword] = await to(ResetPasswordRepository.findByToken(payload.token));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (!resetPassword) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: getMessage('ERR02017', lang),
    });
  }
  
  const now = moment();
  const expire = moment(resetPassword.token_expires_on);
  if (now.diff(expire) >= 0) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: getMessage('ERR02017', lang),
    });
  }

  [err, updateUserData] = await to(UserRepository.updateById(resetPassword.user_id, {
    password: bcrypt.hashSync(payload.new_password, 10),
  }));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }
};

module.exports = ResetPasswordService;
