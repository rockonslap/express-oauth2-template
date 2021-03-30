const to = require('await-to-js').default;
const {
  UserAddressRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');
const { getMessage } = require('../../utils/message');

const Validate = (payload, lang) => {
  const constraints = {
    lat: {
      presence: {
        message: getMessage('ERR02023', lang),
      },
    },
    lng: {
      presence: {
        message: getMessage('ERR02024', lang),
      },
    },
    name: {
      presence: {
        message: getMessage('ERR02025', lang),
      },
    },
    address: {
      presence: {
        message: getMessage('ERR02026', lang),
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

const UpdateUserAddressService = async (user, id, payload, lang) => {
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

  [err, userAddress] = await to(UserAddressRepository.updateByIdAndUserId(id, user.id, {
    ...payload,
  }));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  return userAddress;
};

module.exports = UpdateUserAddressService;
