const router = require('express').Router();
const to = require('await-to-js').default;
const response = require('../utils/response');

const {
  RequestResetPasswordService,
  ResetPasswordService,
} = require('../services');

router.post('/request', async (req, resp) => {
  [err] = await to(RequestResetPasswordService(req.body, req.query.lang || 'en'));

  return response.format(resp, null, err);
});

router.post('/', async (req, resp) => {
  [err] = await to(ResetPasswordService(req.body, req.query.lang || 'en'));

  return response.format(resp, null, err);
});

module.exports = router;
