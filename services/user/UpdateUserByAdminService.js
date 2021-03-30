const to = require('await-to-js').default;

const {
  UserRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');
const { getMessage } = require('../../utils/message');

const Validate = (payload, lang) => {
  const constraints = {
    active: {
      presence: {
        message: getMessage('ERR02030', lang),
      },
      boolean: {
        message: getMessage('ERR02031', lang),
      },
    },
  };

  return validator(payload, constraints, { fullMessages: false });
};

const UpdateUserByAdminService = async (id, payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  [err, user] = await to(UserRepository.findById(id));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  let updateData = {
    role: payload.role || 'user',
    manage_branches: (payload.manage_branches) ? JSON.stringify(payload.manage_branches) : null,
    active: payload.active,
  };

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

module.exports = UpdateUserByAdminService;
