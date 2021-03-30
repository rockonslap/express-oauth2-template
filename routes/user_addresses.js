const router = require('express').Router();
const to = require('await-to-js').default;
const response = require('../utils/response');

const {
  IsAuthMiddleware,
} = require('../middlewares');

const {
  GetUserAddressListWithPageService,
} = require('../services');

router.get('/me', [IsAuthMiddleware], async (req, resp) => {
  [err, userAddresses] = await to(GetUserAddressListWithPageService(req.user, req.query, req.query.lang || 'en'));

  return response.format(resp, userAddresses, err);
});

module.exports = router;
