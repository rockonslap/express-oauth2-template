const to = require('await-to-js').default;

const {
  UserRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');
const { getMessage } = require('../../utils/message');

const Validate = (payload, lang) => {
  const constraints = {
    image_path: {
      presence: {
        message: getMessage('ERR02019', lang),
      },
    },
    image_url: {
      presence: {
        message: getMessage('ERR02020', lang),
      },
    },
  };

  return validator(payload, constraints, { fullMessages: false });
};

const ChangeProfileImageService = async (user, payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  [err, updateUserData] = await to(UserRepository.updateById(user.id, {
    profile_image_url: payload.image_url,
  }));
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

module.exports = ChangeProfileImageService;
