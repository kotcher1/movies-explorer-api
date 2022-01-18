const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isEmail } = require('validator');

const {
  getUser,
  updateUserInfo,
} = require('../controllers/users');

router.get('/users/me', getUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string()
      .required()
      .custom((value, helpers) => (isEmail(value) ? value : helpers.message('Неверный формат email'))),
  }),
}), updateUserInfo);

module.exports = router;
