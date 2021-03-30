const to = require('await-to-js').default;
const {
  UserAddressRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');

const Validate = (payload, lang) => {
  const constraints = {
    is_default: {
      presence: {
        message: getMessage('ERR02027', lang),
      },
      boolean: {
        message: getMessage('ERR02028', lang),
      },
    },
  };

  return validator(payload, constraints, { fullMessages: false });
};

const UpdateUserAddressIsDefaultService = async (user, id, payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  if (payload.is_default) {
    if (payload.is_default === 'true' || payload.is_default === true) {
      [err, count] = await to(UserAddressRepository.countByUserId(user.id));
      if (err) {
        return Promise.reject({
          status: 500,
          code: 1,
          message: err,
        });
      }

      if (count) {
        [err] = await to(UserAddressRepository.updateIsDefaultUserId(user.id, false));
        if (err) {
          return Promise.reject({
            status: 500,
            code: 1,
            message: err,
          });
        }
      }
    }
  }

  [err] = await to(UserAddressRepository.updateIsDefaultByIdAndUserId(id, user.id, payload.is_default));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }
};

module.exports = UpdateUserAddressIsDefaultService;
