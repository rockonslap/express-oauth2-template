const router = require('express').Router();
const to = require('await-to-js').default;
const response = require('../utils/response');

const {
  IsAuthMiddleware,
  IsRoleMiddleware,
} = require('../middlewares');

const {
  GetUserListWithPageByAdminService,
} = require('../services');

router.get('/', [IsAuthMiddleware, IsRoleMiddleware(['super-admin'])], async (req, resp) => {
  [err, users] = await to(GetUserListWithPageByAdminService(req.query, req.query.lang || 'en'));

  return response.format(resp, users, err);
});

module.exports = router;
