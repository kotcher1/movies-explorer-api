const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CURRENT_JWT } = require('../configs/index');
const Users = require('../models/users');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const AuthError = require('../errors/auth-error');
const {
  USER_ID_NOT_FOUND,
  USER_EMAIL_NOT_VALID,
  DATA_NOT_VALID,
  WRONG_EMAIL_OR_PASSWORD,
} = require('../configs/messages-constants');

module.exports.getUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(USER_ID_NOT_FOUND);
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      name, email, password: hash,
    }))
    .then(() => res.send({
      data: {
        name, email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(USER_EMAIL_NOT_VALID));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(DATA_NOT_VALID));
      }
      return next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new NotFoundError(USER_ID_NOT_FOUND);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(USER_EMAIL_NOT_VALID));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(DATA_NOT_VALID));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError(USER_ID_NOT_FOUND));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        jwt: jwt.sign({
          _id: user._id,
        }, CURRENT_JWT, {
          expiresIn: '7d',
        }),
      });
    })
    .catch(() => {
      next(new AuthError(WRONG_EMAIL_OR_PASSWORD));
    });
};
