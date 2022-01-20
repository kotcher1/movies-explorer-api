const jwt = require('jsonwebtoken');
const { CURRENT_JWT_SECRET } = require('../configs/index');
const AuthError = require('../errors/auth-error');
const { AUTHORIZATION_ERROR } = require('../configs/messages-constants');

module.exports = (req, res, next) => {
  const authorizationInfo = req.headers.authorization;
  if (!authorizationInfo || !authorizationInfo.startsWith('Bearer ')) {
    throw new AuthError(AUTHORIZATION_ERROR);
  }

  const token = authorizationInfo.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, CURRENT_JWT_SECRET);
  } catch (err) {
    next(new AuthError(AUTHORIZATION_ERROR));
  }

  req.user = payload;
  return next();
};
