const crypto = require('crypto');

exports.generateRandomToken = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(256, (err, buffer) => {
      if (err) {
        reject(err);
      }
      const token = crypto
        .createHash('sha1')
        .update(buffer)
        .digest('hex');

      resolve(token);
    });
  });
};

exports.getTokenFromRequestHeader = (req) => {
  return new Promise((resolve, reject) => {
    const token = req.get('Authorization');

    if (!token) {
      reject('Unauthorized');
    }

    const matches = token.match(/Bearer\s(\S+)/);

    if (!matches) {
      reject('Unauthorized');
    }

    resolve(matches[1]);
  });
};
