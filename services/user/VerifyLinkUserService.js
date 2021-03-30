const to = require('await-to-js').default;
const moment = require('moment');

const {
  UserRepository,
  VerifyLinkUserRepository,
  AccessTokenRepository,
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
    otp: {
      presence: {
        message: getMessage('ERR02034', lang),
      },
    },
  };

  return validator(payload, constraints, { fullMessages: false });
};

const VerifyLinkUserService = async (user, userToken, payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  [err, verifyLinkUser] = await to(VerifyLinkUserRepository.findByToken(payload.token));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (!verifyLinkUser) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: getMessage('ERR02017', lang),
    });
  }

  const now = moment();
  const expire = moment(verifyLinkUser.token_expires_on);
  if (now.diff(expire) >= 0) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: getMessage('ERR02036', lang),
    });
  }

  if (verifyLinkUser.user_id !== user.id) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: getMessage('ERR02017', lang),
    });
  }

  if (verifyLinkUser.otp !== payload.otp) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: getMessage('ERR02035', lang),
    });
  }

  [err] = await to(VerifyLinkUserRepository.deleteByToken(payload.token));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  let updateData = {
    username: verifyLinkUser.email,
    email: verifyLinkUser.email,
    line_id: user.line_id,
  };

  [err, updateUserData] = await to(UserRepository.updateById(verifyLinkUser.link_user_id, updateData));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (verifyLinkUser.user_id !== verifyLinkUser.link_user_id) {
    [err] = await to(UserRepository.deleteById(verifyLinkUser.user_id));
    if (err) {
      return Promise.reject({
        status: 500,
        code: 1,
        message: err,
      });
    }
  }

  [err, accessToken] = await to(AccessTokenRepository.findByAccessToken(userToken));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (accessToken) {
    [err] = await to(AccessTokenRepository.updateById(accessToken.id, {
      user_id: verifyLinkUser.link_user_id,
    }));
    if (err) {
      return Promise.reject({
        status: 500,
        code: 1,
        message: err,
      });
    }
  }
};

module.exports = VerifyLinkUserService;
