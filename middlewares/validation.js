const { celebrate, Joi } = require('celebrate');
const { isEmail, isURL } = require('validator');
const { INVALID_LINK_FORMAT, INVALID_EMAIL_FORMAT } = require('../configs/messages-constants');

const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string()
      .required()
      .custom((value, helpers) => (isEmail(value) ? value : helpers.message(INVALID_EMAIL_FORMAT))),
  }),
});

const addMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(100).required(),
    director: Joi.string().min(2).max(100).required(),
    duration: Joi.number().required(),
    year: Joi.string().length(4).required(),
    description: Joi.string().min(2).max(1500).required(),
    image: Joi.string()
      .required()
      .custom((value, helpers) => (isURL(value)
        ? value
        : helpers.message(INVALID_LINK_FORMAT))),
    trailer: Joi.string()
      .required()
      .custom((value, helpers) => (isURL(value)
        ? value
        : helpers.message(INVALID_LINK_FORMAT))),
    thumbnail: Joi.string()
      .required()
      .custom((value, helpers) => (isURL(value)
        ? value
        : helpers.message(INVALID_LINK_FORMAT))),
    movieId: Joi.number().required(),
    nameRU: Joi.string().min(2).max(100).required(),
    nameEN: Joi.string().min(2).max(100).required(),
  }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex(),
  }),
});

const signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const signupValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports = {
  updateUserValidator,
  addMovieValidator,
  deleteMovieValidator,
  signinValidator,
  signupValidator,
};
