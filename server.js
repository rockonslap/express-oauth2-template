const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const to = require('await-to-js').default;

const response = require('./utils/response');

const {
  userRoute,
  usersRoute,
  userAddressRoute,
  userAddressesRoute,
  resetPasswordRoute,
} = require('./routes');

const {
  TokenService,
  RegisterService,
  FacebookLoginService,
  LineLoginService,
  LiffLoginService,
} = require('./services');

const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

app.post('/dialog/token', async (req, resp) => {
  [err, token] = await to(TokenService(req.body, req.query.lang || 'en'));

  return response.format(resp, token, err);
});

app.post('/register', async (req, resp) => {
  [err, user] = await to(RegisterService(req.body, req.query.lang || 'en'));

  return response.format(resp, user, err);
});

app.post('/facebook-login', async (req, resp) => {
  [err, token] = await to(FacebookLoginService(req.body, req.query.lang || 'en'));

  return response.format(resp, token, err);
});

app.post('/line-login', async (req, resp) => {
  [err, token] = await to(LineLoginService(req.body, req.query.lang || 'en'));

  return response.format(resp, token, err);
});

app.post('/liff-login', async (req, resp) => {
  [err, token] = await to(LiffLoginService(req.body, req.query.lang || 'en'));

  return response.format(resp, token, err);
});

app.use('/user', userRoute);
app.use('/users', usersRoute);
app.use('/user-address', userAddressRoute);
app.use('/user-addresses', userAddressesRoute);
app.use('/reset-password', resetPasswordRoute);

app.get('/', (req, resp) => {
  resp.json({
    service: 'EXPRESS OAUTH2 EXAMPLE',
    version:  1.0,
  });
});

app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(process.env.NODE_ENV);
    console.info(`==> Listening on port ${PORT}.`);
  }
});
