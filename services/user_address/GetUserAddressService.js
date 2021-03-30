const to = require('await-to-js').default;
const {
  UserAddressRepository,
} = require('../../repositories');

const GetUserAddressService = async (user, id) => {
  [err, userAddress] = await to(UserAddressRepository.findByIdAndUserId(id, user.id));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  return userAddress;
};

module.exports = GetUserAddressService;
