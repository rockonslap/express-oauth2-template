const router = require('express').Router();
// const multer = require('multer');
const to = require('await-to-js').default;
// const path = require('path');
// const GCStroage = require('../utils/gcStorage');
const response = require('../utils/response');

const {
  IsAuthMiddleware,
  IsRoleMiddleware,
} = require('../middlewares');

const {
  UpdateUserProfileService,
  ChangePasswordService,
  ChangeProfileImageService,
  CreateUserByAdminService,
  GetUserByAdminService,
  UpdateUserByAdminService,
  SetUserEmailService,
  VerifyLinkUserService,
} = require('../services');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, '/tmp');
//   },
//   filename: (req, file, cb) => {
//     const { fieldname: fieldName, originalname: originalName } = file || {};
//     const extension = path.extname(originalName);
//     cb(null, `${fieldName}-${Date.now()}${extension}`);
//   },
// });
// const upload = multer({
//   storage,
//   limit: {
//     fileSize: 4194304,
//   },
// });

router.get('/me', [IsAuthMiddleware], (req, resp) => {
  return response.format(resp, req.user, null);
});

router.put('/me', [IsAuthMiddleware], async (req, resp) => {
  [err, user] = await to(UpdateUserProfileService(req.user, req.body, req.query.lang || 'en'));

  return response.format(resp, user, err);
});

router.put('/me/change-password', [IsAuthMiddleware], async (req, resp) => {
  [err] = await to(ChangePasswordService(req.user, req.body, req.query.lang || 'en'));

  return response.format(resp, null, err);
});

// router.put('/me/change-profile-image', [IsAuthMiddleware, upload.single('file')], async (req, resp) => {
//   const gcStorage = new GCStroage();
//   [err, image] = await to(gcStorage.sendUploadToGCS(req.file, 'user'));
//   if (err) {
//     return response.format(resp, null, {
//       status: 502,
//       code: 502,
//       message: err.err,
//     });
//   }

//   [err, user] = await to(ChangeProfileImageService(user, image));

//   return response.format(resp, user, err);
// });

router.put('/me/set-email', [IsAuthMiddleware], async (req, resp) => {
  [err, data] = await to(SetUserEmailService(req.user, req.body, req.query.lang || 'en'));

  return response.format(resp, data, err);
});

router.put('/me/verify-link-user', [IsAuthMiddleware], async (req, resp) => {
  [err] = await to(VerifyLinkUserService(req.user, req.user_token, req.body, req.query.lang || 'en'));

  return response.format(resp, null, err);
});

router.post('/', [IsAuthMiddleware, IsRoleMiddleware(['super-admin'])], async (req, resp) => {
  [err, user] = await to(CreateUserByAdminService(req.body, req.query.lang || 'en'));

  return response.format(resp, user, err);
});

router.get('/:id([0-9]+)', [IsAuthMiddleware, IsRoleMiddleware(['super-admin'])], async (req, resp) => {
  [err, user] = await to(GetUserByAdminService(req.params.id, req.query.lang || 'en'));

  return response.format(resp, user, err);
});

router.put('/:id([0-9]+)', [IsAuthMiddleware, IsRoleMiddleware(['super-admin'])], async (req, resp) => {
  [err, user] = await to(UpdateUserByAdminService(req.params.id, req.body, req.query.lang || 'en'));

  return response.format(resp, user, err);
});

module.exports = router;
