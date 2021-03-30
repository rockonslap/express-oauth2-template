const to = require('await-to-js').default;
const {
  UserAddressRepository,
} = require('../../repositories');

const DeleteUserAddressService = async (user, id) => {
  [err] = await to(UserAddressRepository.deleteByIdAndUserId(id, user.id));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }
};

module.exports = DeleteUserAddressService;
