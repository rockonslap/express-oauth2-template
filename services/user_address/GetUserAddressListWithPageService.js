const to = require('await-to-js').default;
const { UserAddressRepository } = require('../../repositories');

const GetUserAddressListWithPageService = async (user, payload) => {
  const defaultParams = { page: 1 };
  const { page } = { ...defaultParams, ...payload };
  [err, userAddresses] = await to(UserAddressRepository.findByUserIdWithPage(user.id, page));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  return userAddresses;
};

module.exports = GetUserAddressListWithPageService;
