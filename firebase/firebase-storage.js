const { Storage } = require('@google-cloud/storage');

const config = require('../config');

const storage = new Storage({
  projectId: config.firebaseProject,
  keyFilename: `${__dirname}/firebase-admin-key.json`,
});

module.exports = storage.bucket(config.bucketStorage);
