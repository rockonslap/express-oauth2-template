const to = require('await-to-js').default;
const axios = require('axios');

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

const FacebookLoginService = async (payload, lang) => {
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

  [err, respToken] = await to(axios.get('https://graph.facebook.com/v4.0/oauth/access_token',
    {
      params: {
        client_id: 'FB APP ID',
        client_secret: 'FB APP SECRET',
        redirect_uri: payload.redirect_uri || 'REDIRECT URI',
        code: payload.authorization_code,
      },
    },
  ));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: getMessage('ERR02033', lang),
    });
  }
  
  [err, resp] = await to(axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${respToken.data.access_token}`));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: getMessage('ERR02006', lang),
    });
  }

  const fbProfile = resp.data
  const fbId = fbProfile.id;

  [err, count] = await to(UserRepository.countByFbId(fbId));
  if (err) {
    return Promise.reject({
      status: 500,
      code: 1,
      message: err,
    });
  }

  if (count > 0) {
    [err, user] = await to(UserRepository.findByFbId(fbId));
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
    [err, count] = await to(UserRepository.countByUsername(fbProfile.email));
    if (err) {
      return Promise.reject({
        status: 500,
        code: 1,
        message: err,
      });
    }

    if (count > 0) {
      return Promise.reject({
        status: 400,
        code: 1,
        message: getMessage('ERR02007', lang),
      });
    }

    // const gcStorage = new GCStroage();
    // [err, image] = await to(gcStorage.getImageFromUrlAndUploadToGCS(` https://graph.facebook.com/${fbProfile.id}/picture?type=large`, 'user'));
    // if (err) {
    //   return Promise.reject({
    //     status: 502,
    //     code: 502,
    //     message: err.err,
    //   });
    // }
    
    [err, user] = await to(UserRepository.createOne({
      username: fbProfile.email || fbId,
      email: fbProfile.email || '',
      full_name: fbProfile.name,
      tel: '',
      // profile_image_url: image.image_url,
      profile_image_url: '',
      fb_id: fbId,
      role: 'user',
    }));
    if (err) {
      return Promise.reject({
        status: 500,
        code: 1,
        message: err,
      });
    }

    if (user.email) {
      // TODO Send Email
    }

    [err, token] = await to(generateToken(user, client));    
    if (err) {
      return Promise.reject(err);
    }

    return token;
  }
};

module.exports =  FacebookLoginService;
