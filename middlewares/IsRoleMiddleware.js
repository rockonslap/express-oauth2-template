const response = require('../utils/response');

const IsRoleMiddleware = (roles) => {
  return (req, resp, next) => {
    const pass = roles.includes(req.user.role);
    if (!pass) {
      return response.format(resp, null, {
        status: 401,
        code: 1,
        message: 'Do not have permission to access here',
      });
    }

    next();
  };
};

module.exports = IsRoleMiddleware;
