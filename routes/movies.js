const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovie);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(100).required(),
    director: Joi.string().min(2).max(100).required(),
    duration: Joi.number().required(),
    year: Joi.string().length(4).required(),
    description: Joi.string().min(2).max(1500).required(),
    image: Joi.string().required().pattern(/https*:\/\/[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{1,}\.[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{1,}#*/i),
    trailer: Joi.string().required().pattern(/https*:\/\/[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{1,}\.[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{1,}#*/i),
    thumbnail: Joi.string().required().pattern(/https*:\/\/[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{1,}\.[a-z0-9-._~:/?#[\]@!$&'()*+,;=]{1,}#*/i),
    movieId: Joi.number().required(),
    nameRU: Joi.string().min(2).max(100).required(),
    nameEN: Joi.string().min(2).max(100).required(),
  }),
}), createMovie);

router.delete('/movies/movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
