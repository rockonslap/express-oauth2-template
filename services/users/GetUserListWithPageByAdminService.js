const to = require('await-to-js').default;
const { UserRepository } = require('../../repositories');

const GetUserListWithPageByAdminService = async (payload) => {
  const defaultParams = { page: 1, role: null, search: null };
  const { page, role, search } = { ...defaultParams, ...payload };
  [err, users] = await to(UserRepository.findWithPage(page, role, search));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  return {
    ...users,
    lists: users.lists.map((user) => {
      return {
        ...user,
        password: undefined,
      }
    }),
  };
};

module.exports = GetUserListWithPageByAdminService;
