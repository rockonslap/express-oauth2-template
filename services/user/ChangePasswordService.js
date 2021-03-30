const to = require('await-to-js').default;
const bcrypt = require('bcryptjs');

const {
  UserRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');
const { getMessage } = require('../../utils/message');

const Validate = (payload, lang) => {
  const constraints = {
    old_password: {
      presence: {
        message: getMessage('ERR02018', lang),
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

const ChangePasswordService = async (user, payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  [err, userData] = await to(UserRepository.findByIdAndActive(user.id));

  const comparePassword = bcrypt.compareSync(payload.old_password, userData.password);
  if (!comparePassword) {
    return Promise.reject({
      status: 401,
      code: 1,
      message: getMessage('ERR02029', lang),
    });
  }

  [err, updateUserData] = await to(UserRepository.updateById(user.id, {
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

module.exports = ChangePasswordService;
