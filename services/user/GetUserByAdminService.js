const to = require('await-to-js').default;
const {
  UserRepository,
} = require('../../repositories');

const GetUserByAdminService = async (id) => {
  [err, user] = await to(UserRepository.findById(id));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  return {
    ...user,
    password: undefined,
  };
};

module.exports = GetUserByAdminService;
