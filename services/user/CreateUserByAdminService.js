const to = require('await-to-js').default;
const bcrypt = require('bcryptjs');

const {
  UserRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');
const { getMessage } = require('../../utils/message');

const Validate = (payload, lang) => {
  const constraints = {
    email: {
      presence: {
        allowEmpty: false,
        message: getMessage('ERR02013', lang),
      },
    },
    password: {
      presence: {
        allowEmpty: false,
        message: getMessage('ERR02009', lang),
      },
    },
    full_name: {
      presence: {
        allowEmpty: false,
        message: getMessage('ERR02021', lang),
      },
    },
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

const CreateUserByAdminService = async (payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  [err, count] = await to(UserRepository.countByUsername(payload.email));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (count > 0) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: getMessage('ERR02007', lang),
    });
  }

  [err, user] = await to(UserRepository.createOne({
    username: payload.email.toLowerCase(),
    password: bcrypt.hashSync(payload.password, 10),
    email: payload.email,
    full_name: payload.full_name,
    role: payload.role || 'user',
    active: payload.active,
  }));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  // TODO Send Email

  return {
    ...user,
    password: undefined,
  };
};

module.exports = CreateUserByAdminService;
