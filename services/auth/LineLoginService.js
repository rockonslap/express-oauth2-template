require('dotenv').config();
const to = require('await-to-js').default;
const axios = require('axios');
const qs = require('qs');

const {
  ClientRepository,
  UserRepository,
} = require('../../repositories');
const validator = require('../../utils/validator');
const { generateRandomToken } = require('../../utils/token');
// const GCStroage = require('../../utils/gcStorage');
const { getMessage } = require('../../utils/message');

const CreateToken = require('./CreateToken');

const Validate = (payload, lang) => {
  const constraints = {
    client_id: {
      presence: {
        message: getMessage('ERR02001', lang),
      },
    },
    client_secret: {
      presence: {
        message: getMessage('ERR02002', lang),
      },
    },
    authorization_code: {
      presence: {
        message: getMessage('ERR02032', lang),
      },
    }
  };

  return validator(payload, constraints, { fullMessages: false });
};

const generateToken = async (user, client) => {
  [err, accessToken] = await to(generateRandomToken());
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  [err, refreshToken] = await to(generateRandomToken());
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  [err, token] = await to(CreateToken({
    access_token: accessToken,
    refresh_token: refreshToken,
    user_id: user.id,
    client_id: client.id,
  }));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  return token;
}

const LineLoginService = async (payload, lang) => {
  let err = Validate(payload, lang);
  if (err) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: err,
    });
  }

  [err, client] = await to(ClientRepository.findByCredential(payload));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (!client) {
    return Promise.reject({
      status: 400,
      code: 1,
      message: getMessage('ERR02005', lang),
    });
  }
  
  [err, respToken] = await to(axios.post('https://api.line.me/oauth2/v2.1/token', qs.stringify({
    grant_type: 'authorization_code',
    client_id: 'LINE APP ID',
    client_secret: 'LINE APP SECRET',
    redirect_uri: payload.redirect_uri || 'REDIRECT URI',
    code: payload.authorization_code,
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  }));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: getMessage('ERR02033', lang),
    });
  }

  [err, resp] = await to(axios({
    method: 'GET',
    url: 'https://api.line.me/v2/profile',
    headers: {
      Authorization: `Bearer ${respToken.data.access_token}`,
    },
  }));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: getMessage('ERR02033', lang),
    });
  }

  const lineProfile = resp.data
  const lineId = lineProfile.userId;

  [err, count] = await to(UserRepository.countByLineId(lineId));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (count > 0) {
    [err, user] = await to(UserRepository.findByLineId(lineId));
    if (err) {
      return Promise.reject({
        status: 500,
        code: 1,
        message: err,
      });
    }

    [err, token] = await to(generateToken(user, client));
    if (err) {
      return Promise.reject(err);
    }

    return token;
  } else {
    // const gcStorage = new GCStroage();
    // [err, image] = await to(gcStorage.getImageFromUrlAndUploadToGCS(lineProfile.pictureUrl, 'user'));
    // if (err) {
    //   return Promise.reject({
    //     status: 502,
    //     code: 502,
    //     message: err.err,
    //   });
    // }
    
    [err, user] = await to(UserRepository.createOne({
      username: lineId,
      email: '',
      full_name: lineProfile.displayName,
      tel: '',
      // profile_image_url: image.image_url,
      profile_image_url: '',
      line_id: lineId,
      role: 'user',
    }));
    if (err) {
      return Promise.reject({
        status: 500,
        code: 1,
        message: err,
      });
    }

    [err, token] = await to(generateToken(user, client));    
    if (err) {
      return Promise.reject(err);
    }

    return token;
  }
};

module.exports =  LineLoginService;
