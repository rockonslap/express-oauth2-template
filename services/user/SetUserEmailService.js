const to = require('await-to-js').default;
const moment = require('moment');
const crypto = require('crypto');

const { generateRandomToken } = require('../../utils/token');
const { getMessage } = require('../../utils/message');

const {
  UserRepository,
  VerifyLinkUserRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');

const Validate = (payload, lang) => {
  const constraints = {
    email: {
      presence: {
        allowEmpty: false,
        message: getMessage('ERR02013', lang),
      },
    },
  };

  return validator(payload, constraints, { fullMessages: false });
};

const SetUserEmailService = async (user, payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }
  
  [err, userExist] = await to(UserRepository.findByUsername(payload.email));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
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

  const otp = crypto.randomBytes(3).toString('hex').toUpperCase();

  [err, verifyLinkUser] = await to(VerifyLinkUserRepository.createOne({
    user_id: user.id,
    link_user_id: (userExist) ? userExist.id : user.id,
    email: (userExist) ? userExist.email : payload.email,
    token,
    otp,
    token_expires_on: moment().add(5, 'minutes').format(),
  }));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  const refOtp = `VU${verifyLinkUser.id}`;

  // TODO Send Email

  return {
    ref_otp: refOtp,
    token,
    exist: !!(userExist),
  };
};

module.exports = SetUserEmailService;
