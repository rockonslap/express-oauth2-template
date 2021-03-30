const validate = require('validate.js');
const moment = require('moment');
const Q = require('q');

validate.Promise = Q.Promise;

validate.extend(validate.validators.datetime, {
  parse: (value) => {
    return +moment.utc(value);
  },
  format: (value, options) => {
    const format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  },
});

validate.validators.array = (arrayItems, options) => {
  if (arrayItems && arrayItems.length) {
    const arrayItemErrors = arrayItems.reduce((errors, item, index) => {
      const error = validate(item, options);
      if (error) errors[index] = error;
      return errors;
    }, []);

    return !arrayItemErrors.length ? null : arrayItemErrors;
  }
  return null;
};

validate.validators.boolean = (value, options, key) => {
  const { message } = options;
  if (!validate.isBoolean(value)) {
    if (message) {
      return message;
    }
    return `${key} must be Boolean`;
  }
};


module.exports = validate;
