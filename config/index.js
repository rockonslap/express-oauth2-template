const config = {
  development: {
    firebaseProject: '',
    bucketStorage: '',
  },
};
module.exports = config[process.env.NODE_ENV || 'development'];
