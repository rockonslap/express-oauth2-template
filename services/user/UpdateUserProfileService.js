const to = require('await-to-js').default;

const {
  UserRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');
const { getMessage } = require('../../utils/message');

const Validate = (payload, lang) => {
  const constraints = {
    full_name: {
      presence: {
        allowEmpty: false,
        message: getMessage('ERR02021', lang),
      },
    },
    tel: {
      presence: {
        message: getMessage('ERR02022', lang),
      },
    },
  };

  return validator(payload, constraints, { fullMessages: false });
};

const UpdateUserProfileService = async (user, payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  let updateData = {
    full_name: payload.full_name,
    tel: payload.tel,
  };

  // if (payload.email) {
  //   updateData.email = payload.email;
  // }

  [err, updateUserData] = await to(UserRepository.updateById(user.id, updateData));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  return {
    ...user,
    ...updateUserData,
    password: undefined,
  };
};

module.exports = UpdateUserProfileService;
