const { UNAUTHORIZED } = require('../configs/statuses-constants');

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED;
  }
}

module.exports = AuthError;
