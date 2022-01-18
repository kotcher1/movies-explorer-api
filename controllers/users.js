const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/not-found-error');
const ConflictError = require('../errors/conflict-error');
const AuthError = require('../errors/auth-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному id не найден');
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
        return next(new ConflictError('Пользователь с данным email уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Произошла ошибка валидации'));
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
      throw new NotFoundError('Пользователь по указанному id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Пользователь по указанному id не найден'));
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
        }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', {
          expiresIn: '7d',
        }),
      });
    })
    .catch(() => {
      next(new AuthError('Проверьте логин и пароль'));
    });
};
