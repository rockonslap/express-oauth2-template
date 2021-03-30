const router = require('express').Router();
const to = require('await-to-js').default;
const response = require('../utils/response');

const {
  IsAuthMiddleware,
} = require('../middlewares');

const {
  CreateUserAddressService,
  GetUserAddressService,
  UpdateUserAddressService,
  DeleteUserAddressService,
  UpdateUserAddressIsDefaultService,
} = require('../services');

router.post('/me', [IsAuthMiddleware], async (req, resp) => {
  [err, userAddress] = await to(CreateUserAddressService(req.user, req.body, req.query.lang || 'en'));

  return response.format(resp, userAddress, err);
});

router.get('/me/:id([0-9]+)', [IsAuthMiddleware], async (req, resp) => {
  [err, userAddress] = await to(GetUserAddressService(req.user, req.params.id, req.query.lang || 'en'));

  return response.format(resp, userAddress, err);
});

router.put('/me/:id([0-9]+)', [IsAuthMiddleware], async (req, resp) => {
  [err, userAddress] = await to(UpdateUserAddressService(req.user, req.params.id, req.body, req.query.lang || 'en'));

  return response.format(resp, userAddress, err);
});

router.put('/me/:id([0-9]+)/change-default', [IsAuthMiddleware], async (req, resp) => {
  [err] = await to(UpdateUserAddressIsDefaultService(req.user, req.params.id, req.body, req.query.lang || 'en'));

  return response.format(resp, null, err);
});

router.delete('/me/:id([0-9]+)', [IsAuthMiddleware], async (req, resp) => {
  [err] = await to(DeleteUserAddressService(req.user, req.params.id, req.query.lang || 'en'));

  return response.format(resp, null, err);
});

module.exports = router;
